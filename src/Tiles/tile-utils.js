export const buildTile = ({ vertical, horizontal }) => {
  return markStreets(markRooms(wallsHorizontal(wallsVertical(emptyTile(), vertical), horizontal)))
}

function emptyTile() {
  let tileMatrix = []

  for (let i = 0; i < 9; i++) {
    let tileRow = []
    for (let j = 0; j < 9; j++) {
      tileRow.push({
        coords: [i, j],
        north: 'open',
        east: 'open',
        south: 'open',
        west: 'open',
      })
    }
    tileMatrix.push(tileRow)
  }

  return tileMatrix
}

function wallsHorizontal(layout, walls) {
  let updatedLayout = [...layout]
  walls.forEach(wall => {
    const [ startX, startY ] = wall[0].split(',').map(item => parseInt(item, 10))
    const doorwayLocations = typeof wall[2] !== 'undefined' && (Array.isArray(wall[2]) ? [...wall[2]] : [wall[2]])

    for (let i = 0; i < wall[1]; i++) {
      const isDoorway = doorwayLocations && doorwayLocations.includes(i)
      const wallType = isDoorway ? 'door' : 'wall'

      if (updatedLayout[startX] && updatedLayout[startX][startY + i]) {
        updatedLayout[startX][startY + i] = {
          ...updatedLayout[startX][startY + i],
          south: wallType
        }
      }
      if (updatedLayout[startX + 1] && updatedLayout[startX + 1][startY + i]) {
        updatedLayout[startX + 1][startY + i] = {
          ...updatedLayout[startX + 1][startY + i],
          north: wallType
        }
      }
    }
  })

  return updatedLayout
}

function wallsVertical(layout, walls) {
  let updatedLayout = [...layout]
  walls.forEach(wall => {
    const [startX, startY] = wall[0].split(',').map(item => parseInt(item, 10))
    const doorwayLocations = typeof wall[2] !== 'undefined' && (Array.isArray(wall[2]) ? [...wall[2]] : [wall[2]])

    for (let i = 0; i < wall[1]; i++) {
      const isDoorway = doorwayLocations && doorwayLocations.includes(i)
      const wallType = isDoorway ? 'door' : 'wall'

      if (updatedLayout[startX + i] && updatedLayout[startX + i][startY]) {
        updatedLayout[startX + i][startY] = {
          ...updatedLayout[startX + i][startY],
          east: wallType
        }
      }
      if (updatedLayout[startX + i] && updatedLayout[startX + i][startY + 1]) {
        updatedLayout[startX + i][startY + 1] = {
          ...updatedLayout[startX + i][startY + 1],
          west: wallType
        }
      }
    }
  })

  return updatedLayout
}

function markRooms(layout) {
  const bounds = ['wall', 'door']
  const detectCorner = (cell) => {
    if (bounds.includes(cell.north) && bounds.includes(cell.west)) {
      return 'nw'
    } else if (bounds.includes(cell.north) && bounds.includes(cell.east)) {
      return 'ne'
    } else if (bounds.includes(cell.south) && bounds.includes(cell.west)) {
      return 'sw'
    } else if (bounds.includes(cell.south) && bounds.includes(cell.east)) {
      return 'se'
    } else {
      return false
    }
  }

  let corners = {
    nw: [], ne: [], sw: [], se: []
  }

  layout.forEach((row, i) => {
    row.forEach((cell, j) => {
      const cornerType = detectCorner(cell)
      if (cornerType) {
        corners[cornerType].push(`${i},${j}`)
      }
    })
  })

  let updatedLayout = [...layout]
  let roomCount = corners.nw.length

  while (roomCount--) {
    const start = corners.nw[roomCount]
    const end = corners.se[roomCount]
    let xIterator = parseInt(start.split(',')[0], 10)
    const xEnd = parseInt(end.split(',')[0], 10)

    while (xIterator <= xEnd) {
      let yIterator = parseInt(start.split(',')[1], 10)
      const yEnd = parseInt(end.split(',')[1], 10)
      while (yIterator <= yEnd) {
        updatedLayout[xIterator][yIterator].room = roomCount
        yIterator++
      }
      xIterator++
    }
  }

  return updatedLayout
}

function markStreets(layout) {
  let updatedLayout = [...layout]
  const isStreet = (cell) => !cell.hasOwnProperty('room')
  const possibleStreets = [ '0,0', '0,3', '0,6', '3,0', '3,6', '6,0', '6,3', '6,6', ]
  let actualStreets = []

  possibleStreets.forEach(coords => {
    const [ x, , y ] = coords
    if (isStreet(layout[x][y])) {
      actualStreets.push(coords)
    }
  })

  let streetCount = actualStreets.length

  while (streetCount--) {
    const start = actualStreets[streetCount]
    const end = actualStreets[streetCount].split(',').map(num => parseInt(num, 10) + 2).join(',')
    let xIterator = parseInt(start.split(',')[0], 10)
    const xEnd = parseInt(end.split(',')[0], 10)

    while (xIterator <= xEnd) {
      let yIterator = parseInt(start.split(',')[1], 10)
      const yEnd = parseInt(end.split(',')[1], 10)

      while (yIterator <= yEnd) {
        updatedLayout[xIterator][yIterator].street = streetCount
        yIterator++
      }
      xIterator++
    }
  }

  return updatedLayout
}

export const rotateTileCW = (template, amount = 0) => {
  const rotateCell = (cell, x, y) => {
    const {north, east, south, west} = cell
    return {
      coords: [x, y],
      north: west,
      east: north,
      south: east,
      west: south,
    }
  }

  let rotatedTemplate = [...template]

  while (amount--) {
    rotatedTemplate = [
      // The `x` element of each row (in reverse order) should make up our rows
      ...rotatedTemplate.reverse()
      // The following iterator is named `x` because it will be the x coordinate value,
      // and the array element is named `unused` very literally
      // eslint-disable-next-line
    ].map((unused, x) => {
      // The next iterator is named `y` because it is the y coordinate value
      return rotatedTemplate.map((row, y) => {
        return rotateCell(row[x], x, y)
      })
    })
  }

  return rotatedTemplate
}
