'use strict'

$(() => {
  const $shipGrid = $('.ship-grid')
  const $fireGrid = $('.fire-grid')
  const $recentAction = $('#recent-action')
  const $resetBtn = $('.reset')
  const $gameBoard = $('.game-board')
  const $startScreen = $('.start-screen')
  const $startBtn = $('.start-button')
  const $boardDisplay = $('.board-display')
  const $newGameBtn = $('.new-game-btn')
  const $endScreen = $('.end-screen')
  const $result = $('.result')
  let logArray = []
  const $logList = $('.log')
  let originalHit
  let recentHits = []
  let userShipsDestroyed = 0
  let cpuShipsDestroyed = 0
  const width = 10


  let takenIndexes = []
  let selectedSpaces = []
  let fireIndex = 0
  let cpuSquaresHit = []
  let cpuSquaresAttacked = []
  let userSquaresHit = []
  let userSquaresAttacked =[]

  // make grid for user fire, user ships, and cpu grid(array)
  for(let i = 0; i<width*width; i++) {
    $shipGrid.append($('<div />'))
    $fireGrid.append($('<div />'))
  }

  // define the squares in each grid
  const $fireSquares = $fireGrid.find('div')
  const $shipSquares = $shipGrid.find('div')

  for(var i = 0; i<$fireSquares.length; i++){
    $fireGrid.find('div')[i].textContent = `${coordinates[i]}`
    $shipGrid.find('div')[i].textContent = `${coordinates[i]}`
  }

  function addCoordinates(){
    for(var i = 0; i<$fireSquares.length; i++){
      $fireSquares.eq(i).addClass('coordinates')
      $shipSquares.eq(i).addClass('coordinates')
    }
  }

  //                                                   CPU SHIP PLACEMENT
  // --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // generate random cpu ship
  function makeShip(size){
    const newRandomShip = Math.random() < 0.5 ? randomVertical(size) : randomHorizontal(size)
    if(takenIndexes.some(index => newRandomShip.includes(index))){
      return makeShip(size)
    }
    takenIndexes.push(...newRandomShip)
    return newRandomShip
  }

  // make random vertical
  function randomVertical(size){
    const randomRangeV = (Math.floor(Math.random() * (10-size)) + 0)
    const randomIndexV = (randomRangeV *10) + (Math.floor(Math.random() * 9) + 0)
    const vertical = []
    let m = 10
    for(let i =0; i<size; i++){
      vertical.push(randomIndexV + m)
      m+= 10
    }
    return vertical
  }

  // make random horizontal
  function randomHorizontal(size){
    const randomRangeH = (Math.floor(Math.random() * 10) + 0)
    const randomIndexH = (randomRangeH *10) + (Math.floor(Math.random() * (11-size)) + 0)
    const horizontal = []
    for(let i =0; i< size; i++){
      horizontal.push(randomIndexH + i)
    }
    return horizontal
  }


  // used for updating index of ship
  function updateShipArray(baseArray, shipArray, i){
    baseArray.forEach(index => {
      shipArray.forEach(shipIndex => $shipSquares.eq(shipIndex).removeClass(`ship ${ships[i].name}`))
      shipArray.forEach(shipIndex => $shipSquares.eq(shipIndex).removeClass('pulse'))
      shipArray.unshift(index)
      shipArray.pop()
      shipArray.forEach(shipIndex => $shipSquares.eq(shipIndex).addClass(`ship ${ships[i].name}`))
      shipArray.forEach(shipIndex => $shipSquares.eq(shipIndex).addClass('pulse'))
      addCoordinates()
    })
  }

  // place the cpu ships on "board"
  function placeCpuShips(){
    $fireSquares.removeClass('ship')
    cpuShips[0].index = makeShip(4)
    cpuShips[1].index = makeShip(2)
    cpuShips[2].index = makeShip(3)
    cpuShips[3].index= makeShip(5)
    cpuShips[4].index = makeShip(3)
    cpuShips.forEach(obj => {
      obj.index.forEach(index => {
        $fireSquares.eq(index).addClass('ship')
      })
    })

    return cpuShips
  }
  //                                                    USER SHIP PLACEMENT
  // ------------------------------------------------------------------------------------------------------------------

  // allow user to place where ships are
  function placeUserShips(i){
    $(document).off()
    // choosing ship to begin placing
    const ship = ships[i].index
    addCoordinates()
    ship.forEach(ship => $shipSquares.eq(ship).addClass(`ship ${ships[i].name}`))
    ship.forEach(ship => $shipSquares.eq(ship).addClass('pulse'))
    // figure out which way user wants to move ship, and if it's possible
    $(document).on('keydown', e =>{
      switch(e.keyCode){
        case 37: if(ship[ship.length-1] % width > ship.length-1 ||
                  (isVertical(ship) && (ship[0] % width > 0))){
          moveShip(ship, i, 'left')
        }
          break
        case 38: if(ship[0] - width >= 0) moveShip(ship, i, 'up')
          break
        case 39: if(ship[0] % width < width-[ship.length] ||
                (isVertical(ship) && (ship[0] % width < width-1))){
          moveShip(ship, i, 'right')
        }
          break
        case 40: if(ship[ship.length-1]+ width < width*width) moveShip(ship, i, 'down')
          break
        case 16: if((!isVertical(ship)) && (ship[0]+ width*ship.length < width*width)) rotateShipVertical(ship, i)
          if((isVertical(ship)) && (ship[0] % width < width-[ship.length-1]) )rotateShipHorizontal(ship, i)
          break
        case 13: if((i < 4) && (!(selectedSpaces.some(index => ship.includes(index))))){
          i++
          ship.forEach(ship => $shipSquares.eq(ship).removeClass('pulse'))
          selectedSpaces.push(...ship)
          placeUserShips(i)
        } else if((i === 4) && (!(selectedSpaces.some(index => ship.includes(index))))){
          ship.forEach(ship => $shipSquares.eq(ship).removeClass('pulse'))
          $recentAction.text('Find Your Opponent\'s Ships! Press Enter or Click to Fire')
          addCoordinates()
          styleShips()
          userTurn()
        }
      }
    })
  }

  function stopScroll(){
    window.addEventListener('keydown', function(e) {
      // space and arrow keys
      if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault()
      }
    }, false)
  }

  // color the ships
  function styleShips(){
    ships.forEach(obj => {
      obj.index.forEach(index => {
        $shipSquares.eq(index).addClass(`${obj.name}`)
      })
    })
  }
  //                                  SHIP ROTATION
  // -------------------------------------------------------------------------------------------------------
  // check if ship is vertical
  function isVertical(ship){
    return ship[1] - ship[0] === 10
  }

  // rotate horizontally
  function rotateShipHorizontal(ship ,i){
    const startingIndex = ship[0]
    const horzShip = []
    for(let i =0; i< ship.length; i++){
      horzShip.push(startingIndex + i)
    }
    updateShipArray(horzShip, ship, i)
    return ship.sort((a,b) => b-a)
  }

  // rotate the ship vertically
  function rotateShipVertical(ship, i){
    const startingIndex = ship[0]
    const verticalShip = []
    let m = 0
    for(let i =0; i<ship.length; i++){
      verticalShip.push(startingIndex + m)
      m+= 10
    }
    updateShipArray(verticalShip, ship, i)
    return ship.sort((a,b) => b-a)
  }
  //                                    SHIP MOVEMENT
  //-------------------------------------------------------------------------------------------------------------
  // move the ship
  function moveShip(ship,i, direction){
    const nextIndex = getNextIndex(ship, direction).sort((a,b) => b-a)
    updateShipArray(nextIndex, ship, i)
    selectedSpaces.forEach(selectedSpace => $shipSquares.eq(selectedSpace).addClass('ship'))
    return ship
  }

  // determine where ship is going next
  function getNextIndex(ship, direction){
    switch(direction){
      case 'right': return ship.map(index => index + 1)
      case 'left': return ship.map(index => index -1)
      case 'up': return ship.map(index => index - width)
      case 'down': return ship.map(index => index + width)
    }
  }

  //                                                COMBAT
  // ---------------------------------------------------------------------------------------------------------
  // after the user press enter to shoot, check if they hit,miss,already hit
  function fire(){
    if($fireSquares.eq(fireIndex).hasClass('hit') ||
      $fireSquares.eq(fireIndex).hasClass('attacked')){
      $recentAction.text('You already hit here,try again')
    } else if(!$fireSquares.eq(fireIndex).hasClass('ship')){
      $(document).off()
      updateText('missed', fireIndex, 'You')
      $fireSquares.eq(fireIndex).addClass('attacked')
      cpuSquaresAttacked.push(fireIndex)
      setTimeout(() => cpuTurn(), 700)
    } else{
      $(document).off()
      $fireSquares.eq(fireIndex).removeClass()
      $fireSquares.eq(fireIndex).addClass('hit')
      updateText('hit', fireIndex, 'You')
      cpuSquaresHit.push(fireIndex)
      cpuSquaresAttacked.push(fireIndex)
      checkForSunk(cpuShips, cpuSquaresHit, $recentAction)
      cpuSquaresHit.length === 5 ? endGame('won!') : setTimeout(() => cpuTurn(), 700)
    }

  }


  // aiming for enemy ship
  function aim(){
    $fireSquares.eq(fireIndex).addClass('firing')
    $(document).off()
    $fireSquares.on('click', e => {
      $fireSquares.eq(fireIndex).removeClass('firing')
      console.log($fireSquares.index(e.target))
      fireIndex = $fireSquares.index(e.target)
      $fireSquares.eq(fireIndex).addClass('firing')
      $fireSquares.off()
      fire()
    })
    $(document).on('keydown click', e => {
      $fireSquares.eq(fireIndex).removeClass('firing')
      switch(e.keyCode) {
        case 37: if(fireIndex % width > 0)fireIndex--
          break
        case 38: if(fireIndex - width >= 0) fireIndex -= width
          break
        case 39: if(fireIndex % width < width-1)fireIndex++
          break
        case 40: if(fireIndex + width < width*width) fireIndex += width
          break
        case 13: fire()
      }
      $fireSquares.eq(fireIndex).addClass('firing')
    })
  }

  // function for cpu intelligent attacks based on previous checks
  function smartAttack(){
    if(!(recentHits)) return undefined
    let possibleOption
    const basicOptions = [1,-1,+10, -10]
    const vertOptions = [+10, -10, +20, -20, +30, -30, +40, -40]
    const sideOptions = [+1, -1, +2, -2, +3, -3, +4, -4, +5, -5]

    if(recentHits.length > 1 &&  ((recentHits[0] -recentHits[1] === 10) || (recentHits)[1]-recentHits[0] ===10)){
      for(var i = 0; i<vertOptions.length; i++){
        possibleOption = originalHit + vertOptions[i]
        if((!(userSquaresAttacked.includes(possibleOption))) &&
          possibleOption>=0 && possibleOption<100) return possibleOption
      }
    }

    if(recentHits.length > 1 &&  ((recentHits[0] -recentHits[1] === 1) || (recentHits)[1]-recentHits[0] ===1)){
      for(var j = 0; j<sideOptions.length; j++){
        possibleOption = originalHit + sideOptions[j]
        if((!(userSquaresAttacked.includes(possibleOption))) &&
        possibleOption>=0 && possibleOption<100) return possibleOption
      }
    }

    if((!(userSquaresAttacked.includes(originalHit+basicOptions[0])))) return originalHit+basicOptions[0]
    if((!(userSquaresAttacked.includes(originalHit+basicOptions[1])))) return originalHit+basicOptions[1]
    if((!(userSquaresAttacked.includes(originalHit+basicOptions[2])))) return originalHit+basicOptions[2]
    if((!(userSquaresAttacked.includes(originalHit+basicOptions[3])))) return originalHit+basicOptions[3]
  }






  // cpu attack function
  function cpuFire(){
    const cpuTarget = smartAttack() || (Math.floor(Math.random() * 99) + 0)
    if($shipSquares.eq(cpuTarget).hasClass('hit') ||
      $shipSquares.eq(cpuTarget).hasClass('attacked')){
      return cpuFire()
    } else if(!$shipSquares.eq(cpuTarget).hasClass('ship')){
      $shipSquares.eq(cpuTarget).addClass('attacked')
      updateText('missed', cpuTarget, 'cpu')
      userSquaresAttacked.push(cpuTarget)
      setTimeout(() => userTurn(), 700)
    } else{
      $shipSquares.eq(cpuTarget).removeClass()
      $shipSquares.eq(cpuTarget).addClass('hit')
      updateText('hit', cpuTarget, 'cpu' )
      userSquaresHit.push(cpuTarget)
      userSquaresAttacked.push(cpuTarget)
      recentHits.unshift(cpuTarget)
      recentHits = recentHits.sort((a, b) => b-a)
      if(recentHits.length === 1){
        originalHit = cpuTarget
      }
      checkForSunk(ships, userSquaresHit, $recentAction, true)
      userSquaresHit.length === 5 ? endGame('lose.') : setTimeout(() => userTurn(), 700)
    }
  }

  $resetBtn.on('click', resetGame)

  // to reset the game to start
  function resetGame(e){
    updateLog('reset')
    cpuShipsDestroyed = 0
    userShipsDestroyed = 0
    $shipSquares.removeClass()
    $fireSquares.removeClass()
    addCoordinates()
    ships.forEach(ship => ship.sunk = false)
    cpuShips.forEach(ship => ship.sunk = false)
    takenIndexes = []
    selectedSpaces = []
    fireIndex = 0
    cpuSquaresHit = []
    cpuSquaresAttacked = []
    userSquaresHit = []
    userSquaresAttacked = []
    logArray = []
    originalHit = undefined
    recentHits = []
    e.target.blur()
    play()
  }

  // check if ship is sunk- if so update the ship object and display to player
  function checkForSunk(array, squaresHit, player, boolean){
    array.forEach(obj => {
      if((obj.index.every(index => squaresHit.includes(index))) &&
      (obj.sunk === false)){
        player.text(`${obj.name} was sunk`)
        if(!boolean){
          logArray.unshift(`${obj.name} was sunk`)
          updateLog()
          obj.index.forEach(index => {
            $fireSquares.eq(index).removeClass()
            $fireSquares.eq(index).addClass('dead')
          })
          cpuShipsDestroyed++
        }
        obj.sunk = true
        // changeDisplay(obj)
        if(boolean){
          logArray.unshift(`Your ${obj.name} was sunk`)
          updateLog()
          recentHits.forEach(index => {
            player.text(`Your ${obj.name} was sunk`)
            $shipSquares.eq(index).removeClass()
            $shipSquares.eq(index).addClass('dead')
          })
          userShipsDestroyed ++
          originalHit = undefined
          recentHits = []
        }
      }
    })
  }

  // logic for updating the battle log in middle of page
  function updateLog(reset){
    if(reset){
      $('.log').empty()
      $('.log li').eq(0).text('')
      logArray = []
      $recentAction.text('Place your ships!')
    }
    if(logArray.length === 12)logArray.pop()
    if(logArray.length>1)$logList.prepend(`<li>${logArray[1]}</li>`)
    $('.log li').eq(12).fadeOut(600, function(){
      $('.log li').eq(12).remove()
    })
  }


  // when game ends, give stats and option to restart
  function endGame(result){
    $gameBoard.hide()
    $boardDisplay.hide()
    $endScreen.show()
    const accuracy = Math.round((cpuSquaresHit.length / cpuSquaresAttacked.length ) * 100)
    const cpuAccuracy = Math.round((userSquaresHit.length / userSquaresAttacked.length) * 100)
    $result.text(`You ${result} You had ${cpuSquaresHit.length} hits from ${cpuSquaresAttacked.length}, for an accuracy of ${accuracy}%. Your opponent had ${userSquaresHit.length} hits from ${userSquaresAttacked.length}, for an accuracy of ${cpuAccuracy}%. You destroyed ${cpuShipsDestroyed} ships while your opponent destroyed ${userShipsDestroyed}.`)
    $newGameBtn.on('click', resetGame)
  }

  function updateText(result, index, attacker){
    const space = coordinates[index]
    if(attacker === 'cpu'){
      $recentAction.text(`The Enemy ${result} on ${space}!`)
      logArray.unshift(`The Enemy ${result} on ${space}!`)
      updateLog()
    } else {
      $recentAction.text(`You ${result} on ${space}!`)
      logArray.unshift(`You ${result} on ${space}!`)
      updateLog()
    }
  }

  //                                      TURN MANAGEMENT
  //----------------------------------------------------------------------------------------------------------
  function userTurn(){
    aim()
  }
  function cpuTurn(){
    cpuFire()
  }
  //start the game
  function play(){
    stopScroll()
    $endScreen.hide()
    $resetBtn.show()
    $startScreen.hide()
    $boardDisplay.show()
    $gameBoard.show()
    placeCpuShips()
    placeUserShips(0)
  }

  function init(){
    $endScreen.hide()
    $resetBtn.hide()
    $boardDisplay.hide()
    $gameBoard.hide()
    $startScreen.show()
    $startBtn.on('click', play)
  }

  init()
})
