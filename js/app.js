'use strict'

$(() => {

  const $shipGrid = $('.ship-grid')
  const $fireGrid = $('.fire-grid')
  const width = 10
  const cpuGrid = []
  const ship1 = [3,2,1,0]
  let fireIndex = 0


  // make grid for user fire, user ships, and cpu grid(array)
  for(let i = 0; i<width*width; i++) {
    $shipGrid.append($('<div />'))
    $fireGrid.append($('<div />'))
    cpuGrid.push(i)
  }
  // define the squares in each grid
  const $fireSquares = $fireGrid.find('div')
  const $shipSquares = $shipGrid.find('div')
  // establish the ships/targeting reticule at start
  ship1.forEach(shipIndex => $shipSquares.eq(shipIndex).addClass('ship'))
  $fireSquares.eq(fireIndex).addClass('firing')

  // figure out which way user wants to move ship
  $(document).on('keydown', e =>{
    const ship = ship1
    switch(e.keyCode){
      case 37: moveShip(ship, 'left')
        break
      case 38: moveShip(ship, 'up')
        break
      case 39: moveShip(ship, 'right')
        break
      case 40: moveShip(ship, 'down')
        break
    }
  })

  function moveShip(ship, direction){
    ship.forEach(shipIndex => $shipSquares.eq(shipIndex).removeClass('ship'))
    const nextIndex = getNextIndex(ship, direction)
    console.log(nextIndex)
    nextIndex.forEach(index => {
      ship.unshift(index)
      ship.pop()
    })
    ship.forEach(shipIndex => $shipSquares.eq(shipIndex).addClass('ship'))

  }

  function getNextIndex(ship, direction){
    switch(direction) {
      case 'right': return ship.map(index => index + 1)
      case 'left': return ship.map(index => index -1)
      case 'down': return ship.map(index => index += width)
      case 'up': return ship.map(index => index -= width)
    }
  }











  // aiming for enemy ship
  function aim(){
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





















})
