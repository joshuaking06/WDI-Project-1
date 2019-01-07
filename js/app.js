'use strict'

$(() => {

  const $shipGrid = $('.ship-grid')
  const $fireGrid = $('.fire-grid')
  const width = 10
  const ships = {
    carrier: [4,3,2,1,0],
    battleship: [3,2,1,0],
    destroyer: [2,1,0],
    submarine: [2,1,0],
    patrolBoat: [1,0]
  }
  const takenIndexes = []
  const selectedSpaces = []
  const cpuShips = {
    cpuBattleship: [],
    cpuPatrolBoat: [],
    cpuSubmarine: [],
    cpuCarrier: [],
    cpuDestroyer: []
  }
  let fireIndex = 0
  const cpuSquaresHit = []
  const userSquaresHit = []


  // make grid for user fire, user ships, and cpu grid(array)
  for(let i = 0; i<width*width; i++) {
    $shipGrid.append($('<div />'))
    $fireGrid.append($('<div />'))
    // cpuGrid.push(i)
  }


  // define the squares in each grid
  const $fireSquares = $fireGrid.find('div')
  const $shipSquares = $shipGrid.find('div')








  //                                                    SHIP PLACEMENT
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

  // place the cpu ships on "board"
  function placeCpuShips(){
    $fireSquares.removeClass('ship')
    cpuShips.cpuBattleship = makeShip(4)
    cpuShips.cpuPatrolBoat = makeShip(2)
    cpuShips.cpuSubmarine = makeShip(3)
    cpuShips.cpuCarrier = makeShip(5)
    cpuShips.cpuDestroyer = makeShip(3)
    for(const ship in cpuShips){
      cpuShips[ship].forEach(shipIndex => {
        $fireSquares.eq(shipIndex).addClass('ship')
      })
    }


    return cpuShips
  }



  // allow user to place where ships are
  function placeUserShips(i){
    $(document).off()
    // choosing ship to begin placing
    const ship = Object.values(ships)[i-1]
    ship.forEach(shipIndex => $shipSquares.eq(shipIndex).addClass('ship userShip'))
    // figure out which way user wants to move ship, and if it's possible
    $(document).on('keydown', e =>{
      switch(e.keyCode){
        case 37: if(ship[ship.length-1] % width > ship.length-1 ||
                  (isVertical(ship) && (ship[0] % width > 0))){
          moveShip(ship, 'left')
        }
          break
        case 38: if(ship[0] - width >= 0) moveShip(ship, 'up')
          break
        case 39: if(ship[0] % width < width-[ship.length] ||
                (isVertical(ship) && (ship[0] % width < width-1))){
          moveShip(ship, 'right')
        }
          break
        case 40: if(ship[0]+ width < width*width) moveShip(ship, 'down')
          break
        case 16: if(!isVertical(ship))rotateShipVertical(ship)
          if(isVertical(ship))rotateShipHorizontal(ship)
          break
        case 13: if((i-1 > 0) && (!(selectedSpaces.some(index => ship.includes(index))))){
          i--
          selectedSpaces.push(...ship)
          placeUserShips(i)
        } else if((i === 1) && (!(selectedSpaces.some(index => ship.includes(index))))){
          styleShips()
          userTurn()
        }
      }
    })
  }
  // color the ships
  function styleShips(){
    ships.battleship.forEach(shipIndex => {
      $shipSquares.eq(shipIndex).addClass('battleship')
    })
    ships.carrier.forEach(shipIndex => {
      $shipSquares.eq(shipIndex).addClass('carrier')
    })
    ships.destroyer.forEach(shipIndex => {
      console.log('adding class')
      $shipSquares.eq(shipIndex).addClass('destroyer')
    })
    ships.submarine.forEach(shipIndex => {
      $shipSquares.eq(shipIndex).addClass('submarine')
    })
    ships.patrolBoat.forEach(shipIndex => {
      $shipSquares.eq(shipIndex).addClass('patrol-boat')
    })
  }


  // check if ship is vertical
  function isVertical(ship){
    return ship[1] - ship[0] === 10
  }


  // rotate horizontally
  function rotateShipHorizontal(ship){
    console.log(ship)
    const startingIndex = ship[0]
    const horzShip = []
    for(let i =0; i< ship.length; i++){
      horzShip.push(startingIndex + i)
    }
    horzShip.forEach(index => {
      ship.forEach(shipIndex => $shipSquares.eq(shipIndex).removeClass('ship userShip'))
      ship.unshift(index)
      ship.pop()
      ship.forEach(shipIndex => $shipSquares.eq(shipIndex).addClass('ship userShip'))
    })
    console.log(ship.sort((a,b) => b-a))
    return ship.sort((a,b) => b-a)
  }




  // rotate the ship vertically
  function rotateShipVertical(ship){
    const startingIndex = ship[0]
    const shipLength = ship.length
    const verticalShip = []
    let m = 0
    for(let i =0; i<shipLength; i++){
      verticalShip.push(startingIndex + m)
      m+= 10
    }
    verticalShip.forEach(index => {
      ship.forEach(shipIndex => $shipSquares.eq(shipIndex).removeClass('ship userShip'))
      ship.unshift(index)
      ship.pop()
      ship.forEach(shipIndex => $shipSquares.eq(shipIndex).addClass('ship userShip'))
    })
    console.log(ship.sort((a,b) => b-a))
    return ship.sort((a,b) => b-a)
  }

  // move the ship
  function moveShip(ship, direction){
    const nextIndex = getNextIndex(ship, direction).sort((a,b) => b-a)
    nextIndex.forEach(index => {
      ship.forEach(shipIndex => $shipSquares.eq(shipIndex).removeClass('ship userShip'))
      ship.unshift(index)
      ship.pop()
      ship.forEach(shipIndex => $shipSquares.eq(shipIndex).addClass('ship userShip'))
    })
    selectedSpaces.forEach(selectedSpace => $shipSquares.eq(selectedSpace).addClass('ship userShip'))
    console.log(ship)
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
      alert('you already hit here,try again')
    } else if(!$fireSquares.eq(fireIndex).hasClass('ship')){
      $(document).off()
      alert('you missed')
      $fireSquares.eq(fireIndex).addClass('attacked')
      cpuTurn()
    } else{
      $(document).off()
      alert('you hit')
      $fireSquares.eq(fireIndex).removeClass()
      $fireSquares.eq(fireIndex).addClass('hit')
      cpuSquaresHit.push(fireIndex)
      cpuSquaresHit.length === 17 ? alert('You win!') : cpuTurn()
    }
  }






  // aiming for enemy ship
  function aim(){
    $fireSquares.eq(fireIndex).addClass('firing')
    console.log(ships.patrolBoat)
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



  // function for cpu attack
  function cpuFire(hitBefore){
    const cpuTarget = hitBefore +1 || (Math.floor(Math.random() * 99) + 0)
    if($shipSquares.eq(cpuTarget).hasClass('hit') ||
      $shipSquares.eq(cpuTarget).hasClass('attacked')){
      return cpuFire()
    } else if(!$shipSquares.eq(cpuTarget).hasClass('ship')){
      $shipSquares.eq(cpuTarget).addClass('attacked')
      userTurn()
    } else{
      $shipSquares.eq(cpuTarget).removeClass()
      $shipSquares.eq(cpuTarget).addClass('hit')
      userSquaresHit.push(cpuTarget)
      userSquaresHit.length === 17 ? alert('You lose!') : cpuTurn()
    }
  }







  //                                      TURN MANAGEMENT
  //----------------------------------------------------------------------------------------------------------
  // user's turn, update for previous opponent turn and user aims to attack
  function userTurn(){
    // updateCpuScore()
    aim()
  }

  // cpu turn, update score of user after his/her turn and cpu attacks
  function cpuTurn(){
    // updateUserScore()
    cpuFire()
  }


  // starting the game
  function play(){
    placeCpuShips()
    placeUserShips(5)
  }

  play()















})
