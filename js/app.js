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
  let fireIndex = 0


  // make grid for user fire, user ships, and cpu grid(array)
  for(let i = 0; i<width*width; i++) {
    $shipGrid.append($('<div />'))
    $fireGrid.append($('<div />'))
    // cpuGrid.push(i)
  }



  // define the squares in each grid
  const $fireSquares = $fireGrid.find('div')
  const $shipSquares = $shipGrid.find('div')

  // generate random cpu ship
  function makeShip(size){
    const randomRange = (Math.floor(Math.random() * (11-size)) + 0)
    const randomIndex = (randomRange *10) + (Math.floor(Math.random() * (11-size)) + 0)
    const newShip = []
    for(let i =0; i< size; i++){
      newShip.push(randomIndex + i)
    }
    return newShip
  }

  // place the cpu ships on "board"
  function placeCpuShips(){
    const cpuBattleship = makeShip(4)
    return cpuBattleship
  }

  // allow user to place where ships are
  function placeUserShips(i){
    $(document).off()
    // choosing ship to begin placing
    const ship = Object.values(ships)[i-1]
    ship.forEach(shipIndex => $shipSquares.eq(shipIndex).addClass('ship'))
    // figure out which way user wants to move ship, and if it's possible
    $(document).on('keydown', e =>{
      switch(e.keyCode){
        case 37: if(ship[ship.length-1] % width > ship.length-1)moveShip(ship, 'left')
          break
        case 38: if(ship[0] - width >= 0) moveShip(ship, 'up')
          break
        case 39: if(ship[0] % width < width-[ship.length]) moveShip(ship, 'right')
          break
        case 40: if(ship[0]+ width < width*width) moveShip(ship, 'down')
          break
        case 13: if(i-1 > 0){
          i--
          placeUserShips(i)
        } else aim()
      }
    })
  }


  // move the ship
  function moveShip(ship, direction){
    const nextIndex = getNextIndex(ship, direction).sort((a,b) => b-a)
    nextIndex.forEach(index => {
      ship.forEach(shipIndex => $shipSquares.eq(shipIndex).removeClass('ship'))
      ship.unshift(index)
      ship.pop()
      ship.forEach(shipIndex => $shipSquares.eq(shipIndex).addClass('ship'))
    })
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












  // aiming for enemy ship
  function aim(){
    $fireSquares.eq(fireIndex).addClass('firing')
    $(document).off()
    $(document).on('keydown', e => {
      // left 37, up 38, right 39, down 40
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
      }
      $fireSquares.eq(fireIndex).addClass('firing')
    })
  }



  // starting the game
  function play(){
    placeCpuShips()
    placeUserShips(5)
  }

  play()















})
