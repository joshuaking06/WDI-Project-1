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
  let recentlyHit
  let recentHits = []
  const width = 10


  let takenIndexes = []
  let selectedSpaces = []
  let fireIndex = 0
  let cpuSquaresHit = []
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
        case 16: if((!isVertical(ship)) && (ship[ship.length-1]+ width < width*width)) rotateShipVertical(ship, i)
          if((isVertical(ship)) && (ship[0] % width < width-[ship.length-1]) )rotateShipHorizontal(ship, i)
          break
        case 13: if((i < 4) && (!(selectedSpaces.some(index => ship.includes(index))))){
          i++
          ship.forEach(ship => $shipSquares.eq(ship).removeClass('pulse'))
          selectedSpaces.push(...ship)
          placeUserShips(i)
        } else if((i === 4) && (!(selectedSpaces.some(index => ship.includes(index))))){
          ship.forEach(ship => $shipSquares.eq(ship).removeClass('pulse'))
          $recentAction.text('Find Your Opponent\'s Ships!')
          styleShips()
          userTurn()
        }
      }
    })
  }

  function stopScroll(){
    window.addEventListener("keydown", function(e) {
      // space and arrow keys
      if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
      }
    }, false);
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
      setTimeout(() => cpuTurn(), 700)
    } else{
      $(document).off()
      $fireSquares.eq(fireIndex).removeClass()
      $fireSquares.eq(fireIndex).addClass('hit')
      updateText('hit', fireIndex, 'You')
      cpuSquaresHit.push(fireIndex)
      checkForSunk(cpuShips, cpuSquaresHit, $recentAction)
      cpuSquaresHit.length === 17 ? alert('you win') : setTimeout(() => cpuTurn(), 700)
    }

  }


  // aiming for enemy ship
  function aim(){
    $fireSquares.eq(fireIndex).addClass('firing')
    $(document).off()
    $(document).on('keydown', e => {
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
    if(!recentlyHit) return undefined
    if((!(userSquaresAttacked.includes(recentlyHit+1)))) return recentlyHit+1
    if((!(userSquaresAttacked.includes(recentlyHit-1)))) return recentlyHit-1

    if((!(userSquaresAttacked.includes(recentlyHit-1))) &&
    (!(userSquaresAttacked.includes(recentlyHit+1))) &&
    (!(userSquaresAttacked.includes(recentlyHit-2)))) return recentlyHit-2

    if((!(userSquaresAttacked.includes(recentlyHit+width)))) return recentlyHit+width
    if((!(userSquaresAttacked.includes(recentlyHit-width)))) return recentlyHit-width
    if((!(userSquaresAttacked.includes(recentlyHit+width*2)))) return recentlyHit+width*2
    if((!(userSquaresAttacked.includes(recentlyHit-width*2)))) return recentlyHit-width*2


    if((!(userSquaresAttacked.includes(recentlyHit-1))) &&
    (!(userSquaresAttacked.includes(recentlyHit+1))) &&
    (!(userSquaresAttacked.includes(recentlyHit-2)))&&
    (!(userSquaresAttacked.includes(recentlyHit-3)))) return recentlyHit-3

    if((!(userSquaresAttacked.includes(recentlyHit-1))) &&
      (!(userSquaresAttacked.includes(recentlyHit-2))) &&
      (!(userSquaresAttacked.includes(recentlyHit+1)))&&
      (!(userSquaresAttacked.includes(recentlyHit-4)))) return recentlyHit-4
  }


  // cpu attack function
  function cpuFire(){
    const cpuTarget = smartAttack() || (Math.floor(Math.random() * 99) + 0)
    console.log(userSquaresAttacked)
    console.log(cpuTarget)
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
      recentlyHit = cpuTarget
      recentHits.push(recentlyHit)
      checkForSunk(ships, userSquaresHit, $recentAction, true)
      userSquaresHit.length === 17 ? alert('you lose!') : setTimeout(() => userTurn(), 700)
    }
  }

  $resetBtn.on('click', resetGame)

  // to reset the game to start
  function resetGame(e){
    // resetIndices()
    $shipSquares.removeClass()
    $fireSquares.removeClass()
    ships.forEach(ship => ship.sunk = false)
    cpuShips.forEach(ship => ship.sunk = false)
    takenIndexes = []
    selectedSpaces = []
    fireIndex = 0
    cpuSquaresHit = []
    userSquaresHit = []
    userSquaresAttacked = []
    recentlyHit = undefined
    recentHits = []
    console.log(e.target)
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
          obj.index.forEach(index => {
            $fireSquares.eq(index).removeClass()
            $fireSquares.eq(index).addClass('dead')
          })
        }
        obj.sunk = true
        if(boolean){
          recentHits.forEach(index => {
            player.text(`Your ${obj.name} was sunk`)
            $shipSquares.eq(index).removeClass()
            $shipSquares.eq(index).addClass('dead')
          })
          recentlyHit = undefined
          recentHits = []
        }
      }
    })
  }

  function updateText(result, index, attacker){
    const space = coordinates[index]
    if(attacker === 'cpu'){
      $recentAction.text(`The Enemy ${result} on ${space}!`)
    } else {
      $recentAction.text(`You ${result} on ${space}!`)
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
    $resetBtn.show()
    $startScreen.hide()
    $boardDisplay.show()
    $gameBoard.show()
    placeCpuShips()
    placeUserShips(0)
  }

  function init(){
    $resetBtn.hide()
    $boardDisplay.hide()
    $gameBoard.hide()
    $startScreen.show()
    $startBtn.on('click', play)
  }

  init()

})
