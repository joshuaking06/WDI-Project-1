'use strict'

$(() => {

  const $shipGrid = $('.ship-grid')
  const $fireGrid = $('.fire-grid')
  const width = 10
  const $recentActionUser = $('#recent-action-user')
  const $recentActionCpu = $('#recent-action-cpu')
  let recentlyHit
  const ships =[
    {
      name: 'carrier',
      index: [4,3,2,1,0],
      sunk: false
    },{
      name: 'battleship',
      index: [3,2,1,0],
      sunk: false
    },{
      name: 'destroyer',
      index: [2,1,0],
      sunk: false
    },{
      name: 'submarine',
      index: [2,1,0],
      sunk: false
    },{
      name: 'patrolboat',
      index: [1,0],
      sunk: false
    }
  ]
  console.log(ships[1].index)


  const cpuShips = [
    {
      name: 'Enemy Battleship',
      sunk: false
    },{
      name: 'Enemy Patrol Boat',
      sunk: false
    },{
      name: 'Enemy Submarine',
      sunk: false
    },{
      name: 'Enemy Carrier',
      sunk: false
    },{
      name: 'Enemy Destroyer',
      sunk: false
    }

  ]



  const takenIndexes = []
  const selectedSpaces = []



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

  // allow user to place where ships are
  function placeUserShips(i){
    $(document).off()
    // choosing ship to begin placing
    const ship = ships[i].index
    ship.forEach(ship => $shipSquares.eq(ship).addClass(`ship ${ships[i].name}`))
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
          selectedSpaces.push(...ship)
          placeUserShips(i)
        } else if((i === 4) && (!(selectedSpaces.some(index => ship.includes(index))))){
          styleShips()
          userTurn()
        }
      }
    })
  }
  // color the ships
  function styleShips(){
    ships.forEach(obj => {
      obj.index.forEach(index => {
        $shipSquares.eq(index).addClass(`${obj.name}`)
      })
    })
  }

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
    horzShip.forEach(index => {
      ship.forEach(shipIndex => $shipSquares.eq(shipIndex).removeClass(`ship ${ships[i].name}`))
      ship.unshift(index)
      ship.pop()
      ship.forEach(shipIndex => $shipSquares.eq(shipIndex).addClass(`ship ${ships[i].name}`))
    })
    return ship.sort((a,b) => b-a)
  }

  // rotate the ship vertically
  function rotateShipVertical(ship, i){
    const startingIndex = ship[0]
    const shipLength = ship.length
    const verticalShip = []
    let m = 0
    for(let i =0; i<shipLength; i++){
      verticalShip.push(startingIndex + m)
      m+= 10
    }
    verticalShip.forEach(index => {
      ship.forEach(shipIndex => $shipSquares.eq(shipIndex).removeClass(`ship ${ships[i].name}`))
      ship.unshift(index)
      ship.pop()
      ship.forEach(shipIndex => $shipSquares.eq(shipIndex).addClass(`ship ${ships[i].name}`))
    })
    return ship.sort((a,b) => b-a)
  }


  // move the ship
  function moveShip(ship,i, direction){
    const nextIndex = getNextIndex(ship, direction).sort((a,b) => b-a)
    nextIndex.forEach(index => {
      ship.forEach(shipIndex => $shipSquares.eq(shipIndex).removeClass(`ship ${ships[i].name}`))
      ship.unshift(index)
      ship.pop()
      ship.forEach(shipIndex => $shipSquares.eq(shipIndex).addClass(`ship ${ships[i].name}`))
    })
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
      $recentActionUser.text('you already hit here,try again')
    } else if(!$fireSquares.eq(fireIndex).hasClass('ship')){
      $(document).off()
      $recentActionUser.text('You missed!')
      $fireSquares.eq(fireIndex).addClass('attacked')
      setTimeout(function(){
        cpuTurn()
      }, 1000)
    } else{
      $(document).off()
      $fireSquares.eq(fireIndex).removeClass()
      $fireSquares.eq(fireIndex).addClass('hit')
      $recentActionUser.text('You hit an Enemy Ship!')
      cpuSquaresHit.push(fireIndex)
      cpuShips.forEach(obj => {
        if((obj.index.every(index => cpuSquaresHit.includes(index))) &&
        (obj.sunk === false)){
          $recentActionUser.text(`you sunk the ${obj.name}`)
          obj.sunk = true
        }
      })
      cpuSquaresHit.length === 17 ? alert('You win!') : setTimeout(function(){
        cpuTurn()
      }, 1000)
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

  // function for cpu attack
  function cpuFire(){
    const cpuTarget = recentlyHit +1 || (Math.floor(Math.random() * 99) + 0)
    if($shipSquares.eq(cpuTarget).hasClass('hit') ||
      $shipSquares.eq(cpuTarget).hasClass('attacked')){
      return cpuFire()
    } else if(!$shipSquares.eq(cpuTarget).hasClass('ship')){
      $shipSquares.eq(cpuTarget).addClass('attacked')
      $recentActionCpu.text('The Enemy Missed')
      recentlyHit = undefined
      setTimeout(function(){
        userTurn()
      }, 1000)
    } else{
      $shipSquares.eq(cpuTarget).removeClass()
      $shipSquares.eq(cpuTarget).addClass('hit')
      $recentActionCpu.text('The Enemy Hit Your Ship!')
      userSquaresHit.push(cpuTarget)
      recentlyHit = cpuTarget
      ships.forEach(obj => {
        if((obj.index.every(index => userSquaresHit.includes(index))) &&
        (obj.sunk === false)){
          $recentActionCpu.text(`The enemy has sunk your ${obj.name}`)
          obj.sunk = true
          recentlyHit = undefined
        }
      })
      userSquaresHit.length === 17 ? alert('You lose!') : setTimeout(function(){
        userTurn()
      }, 1000)
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
    placeUserShips(0)
  }

  play()
})
