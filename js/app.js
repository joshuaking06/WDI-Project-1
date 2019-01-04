$(() => {


  const $shipGrid = $('.ship-grid')
  const $fireGrid = $('.fire-grid')
  const width = 10
  const cpuGrid = []
  let ship = [3,2,1,0]
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

  ship.forEach(shipIndex => $shipSquares.eq(shipIndex).addClass('ship'))
  $fireSquares.eq(fireIndex).addClass('firing')

  console.log(ship)










})
