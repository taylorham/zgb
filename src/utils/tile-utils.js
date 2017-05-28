export const buildTile = (walls, rotation = 0) => {
  return colorStreets(markRooms(rotateTile(buildWalls(walls), rotation)))
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

  return {
    layout: tileMatrix,
    doors: [],
  }
}

function buildWalls(walls) {
  let { layout, doors } = emptyTile()
  const { vertical, horizontal } = walls
  const manhole = walls.manhole.split(',').map(num => parseInt(num, 10))

  vertical.forEach(wall => {
    const [startX, startY] = wall[0].split(',').map(item => parseInt(item, 10))
    const doorwayLocations = typeof wall[2] !== 'undefined' ? (Array.isArray(wall[2]) ? [...wall[2]] : [wall[2]]) : []

    for (let i = 0; i < wall[1]; i++) {
      const isDoorway = doorwayLocations && doorwayLocations.includes(i)
      const wallType = isDoorway ? 'door' : 'wall'

      if (isDoorway) {
        let newX = startX + i >= 0 ? startX + i : 0
        let newY = startY >= 0 ? startY : 0
        doors.push(`${newX},${newY}`)
      }

      if (layout[startX + i] && layout[startX + i][startY]) {
        layout[startX + i][startY] = {
          ...layout[startX + i][startY],
          west: wallType
        }
      }
      if (layout[startX + i] && layout[startX + i][startY - 1]) {
        layout[startX + i][startY - 1] = {
          ...layout[startX + i][startY - 1],
          east: wallType
        }
      }
    }
  })

  horizontal.forEach(wall => {
    const [ startX, startY ] = wall[0].split(',').map(item => parseInt(item, 10))
    const doorwayLocations = typeof wall[2] !== 'undefined' && (Array.isArray(wall[2]) ? [...wall[2]] : [wall[2]])

    for (let i = 0; i < wall[1]; i++) {
      const isDoorway = doorwayLocations && doorwayLocations.includes(i)
      const wallType = isDoorway ? 'door' : 'wall'

      if (isDoorway) {
        let newX = startX >= 0 ? startX : 0
        let newY = startY + i >= 0 ? startY + i : 0
        doors.push(`${newX},${newY}`)
      }

      if (layout[startX] && layout[startX][startY + i]) {
        layout[startX][startY + i] = {
          ...layout[startX][startY + i],
          north: wallType
        }
      }
      if (layout[startX - 1] && layout[startX - 1][startY + i]) {
        layout[startX - 1][startY + i] = {
          ...layout[startX - 1][startY + i],
          south: wallType
        }
      }
    }
  })

  layout[manhole[0]][manhole[1]].manhole = true

  return {
    layout: layout,
    doors: [...new Set(doors)],
  }
}

function markRooms(tile) {
  const { layout } = tile
  let NWCorners = []

  layout.forEach((row, i) => {
    row.forEach((cell, j) => {
      const isNWCorner = cell.north !== 'open' && cell.west !== 'open'
      if (isNWCorner) {
        NWCorners.push(`${i},${j}`)
      }
    })
  })

  let updatedLayout = [...layout]

  const tileCrawler = ({ coords = '0,0', roomIndex = 0, origin = '0,0' } = {}) => {
    const x = parseInt(coords[0], 10)
    const y = parseInt(coords[2], 10)

    const newOrigin = [x, y]

    const cell = updatedLayout[x][y]
    const nextCell = {
      north: [x - 1, y],
      east: [x, y + 1],
      south: [x + 1, y],
      west: [x, y - 1],
    }
    const canGo = (direction) => {
      const newCell = updatedLayout[nextCell[direction][0]][nextCell[direction][1]]

      return (
        !newCell.hasOwnProperty('room') &&
        cell[direction] === 'open' &&
        nextCell[direction] !== origin
      )
    }
    const nextCoords = []

    if (!cell.hasOwnProperty('room')) {
      cell.room = roomIndex
      if (x > 0 && canGo('north')) nextCoords.push(nextCell.north)
      if (y < 8 && canGo('east')) nextCoords.push(nextCell.east)
      if (x < 8 && canGo('south')) nextCoords.push(nextCell.south)
      if (y > 0 && canGo('west')) nextCoords.push(nextCell.west)

      nextCoords.forEach(nextCoord => tileCrawler({ coords: nextCoord.join(','), roomIndex, origin: newOrigin.join(',') }))
    }

    return false
  }

  NWCorners.forEach((cell, i) => {
    tileCrawler({ coords: cell, roomIndex: i })
  })

  return {
    ...tile,
    layout: updatedLayout
  }
}

function colorStreets(tile) {
  const { layout } = tile
  let updatedLayout = [...layout]
  const isStreet = (cell) => cell.hasOwnProperty('street') && cell.street === true
  const possibleStreets = [ '0,0', '0,3', '0,6', '3,0', '3,6', '6,0', '6,3', '6,6', ]
  let actualStreets = []

  possibleStreets.forEach(coords => {
    const [ x,, y ] = coords
    if (isStreet(layout[x][y])) {
      actualStreets.push(coords)
    }
  })

  let streetCount = actualStreets.length

  while (streetCount--) {
    const start = actualStreets[streetCount].split(',').map(num => parseInt(num, 10))
    const end = actualStreets[streetCount].split(',').map(num => parseInt(num, 10) + 2)
    let xIterator = start[0]
    const xEnd = end[0]

    while (xIterator <= xEnd) {
      let yIterator = start[1]
      const yEnd = end[1]

      while (yIterator <= yEnd) {
        updatedLayout[xIterator][yIterator].street = true
        yIterator++
      }
      xIterator++
    }
  }

  return {
    ...tile,
    layout: updatedLayout
  }
}

export function rotateTile(tile, amount) {
  const { layout } = tile
  const rotateCell = (cell, x, y) => {
    const { north, east, south, west } = cell
    return {
      ...cell,
      coords: [x, y],
      north: west,
      east: north,
      south: east,
      west: south,
    }
  }

  let rotatedLayout = [...layout]

  while (amount--) {
    rotatedLayout = [
      ...rotatedLayout.reverse()
      // eslint-disable-next-line
    ].map((foo, x) => {
      return rotatedLayout.map((row, y) => {
        return rotateCell(row[x], x, y)
      })
    })
  }

  return {
    ...tile,
    layout: rotatedLayout
  }
}
