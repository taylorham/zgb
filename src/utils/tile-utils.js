export const buildTile = (tileCoords, layout) => {
  const { tile, rotation, doors } = layout
  return colorStreets(
    markRooms(rotateTile(buildWalls(tileCoords, { tile, doors }), rotation))
  )
}

function emptyTile(tileCoords) {
  const [tileX, tileY] = tileCoords
  let layout = []

  for (let i = 0; i < 9; i++) {
    let tileRow = []
    for (let j = 0; j < 9; j++) {
      tileRow.push({
        coords: [tileX * 9 + i, tileY * 9 + j],
        north: 'open',
        east: 'open',
        south: 'open',
        west: 'open',
      })
    }
    layout.push(tileRow)
  }

  return {
    layout,
    tileCoords,
  }
}

function buildWalls(tileCoords, walls) {
  let { layout } = emptyTile(tileCoords)
  const doors = new Set()
  const {
    tile: { vertical, horizontal, manhole: manholeCoords },
    doors: lockedDoors,
  } = walls
  const manhole = manholeCoords.split(',').map(num => parseInt(num, 10))

  vertical.forEach(wall => {
    const [startX, startY] = wall[0].split(',').map(item => parseInt(item, 10))
    const doorwayLocations =
      typeof wall[2] !== 'undefined' &&
      (Array.isArray(wall[2]) ? [...wall[2]] : [wall[2]])

    for (let i = 0; i < wall[1]; i++) {
      const isDoorway = doorwayLocations && doorwayLocations.includes(i)
      const wallType = isDoorway ? 'door' : 'wall'

      if (isDoorway) {
        let newX = startX + i >= 0 ? startX + i : 0
        let newY = startY >= 0 ? startY : 0
        doors.add(`${newX},${newY}`)
      }

      if (layout[startX + i] && layout[startX + i][startY]) {
        layout[startX + i][startY] = {
          ...layout[startX + i][startY],
          west: wallType,
        }
      }
      if (layout[startX + i] && layout[startX + i][startY - 1]) {
        layout[startX + i][startY - 1] = {
          ...layout[startX + i][startY - 1],
          east: wallType,
        }
      }
    }
  })

  horizontal.forEach(wall => {
    const [startX, startY] = wall[0].split(',').map(item => parseInt(item, 10))
    const doorwayLocations =
      typeof wall[2] !== 'undefined' &&
      (Array.isArray(wall[2]) ? [...wall[2]] : [wall[2]])

    for (let i = 0; i < wall[1]; i++) {
      const isDoorway = doorwayLocations && doorwayLocations.includes(i)
      const wallType = isDoorway ? 'door' : 'wall'

      if (isDoorway) {
        let newX = startX >= 0 ? startX : 0
        let newY = startY + i >= 0 ? startY + i : 0
        doors.add(`${newX},${newY}`)
      }

      if (layout[startX] && layout[startX][startY + i]) {
        layout[startX][startY + i] = {
          ...layout[startX][startY + i],
          north: wallType,
        }
      }
      if (layout[startX - 1] && layout[startX - 1][startY + i]) {
        layout[startX - 1][startY + i] = {
          ...layout[startX - 1][startY + i],
          south: wallType,
        }
      }
    }
  })

  lockedDoors.forEach(lockedDoor => {
    let [doorX, doorY] = lockedDoor.split(',').map(num => parseInt(num, 10))
    layout[doorX][doorY].lockedDoor = true
  })

  layout[manhole[0]][manhole[1]].manhole = true

  return {
    layout,
    tileCoords,
    doors: [...doors],
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

  const tileCrawler = ({
    coords = '0,0',
    roomIndex = 0,
    origin = '0,0',
  } = {}) => {
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
    const canGo = direction => {
      const newCell =
        updatedLayout[nextCell[direction][0]][nextCell[direction][1]]

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

      nextCoords.forEach(nextCoord =>
        tileCrawler({
          coords: nextCoord.join(','),
          roomIndex,
          origin: newOrigin.join(','),
        })
      )
    }

    return false
  }

  NWCorners.forEach((cell, i) => {
    tileCrawler({ coords: cell, roomIndex: i })
  })

  return {
    ...tile,
    layout: updatedLayout,
  }
}

function colorStreets(tile) {
  const { layout } = tile
  let updatedLayout = [...layout]
  const isStreet = cell => cell.hasOwnProperty('street') && cell.street === true
  const possibleStreets = [
    '0,0',
    '0,3',
    '0,6',
    '3,0',
    '3,6',
    '6,0',
    '6,3',
    '6,6',
  ]
  let actualStreets = []

  possibleStreets.forEach(coords => {
    const [x, , y] = coords
    if (isStreet(layout[x][y])) {
      actualStreets.push(coords)
    }
  })

  let streetCount = actualStreets.length

  while (streetCount--) {
    const start = actualStreets[streetCount]
      .split(',')
      .map(num => parseInt(num, 10))
    const end = actualStreets[streetCount]
      .split(',')
      .map(num => parseInt(num, 10) + 2)
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
    layout: updatedLayout,
  }
}

export function rotateTile(tile, amount) {
  const {
    layout,
    tileCoords: [tileX, tileY],
  } = tile
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
      ...rotatedLayout.reverse(),
      // eslint-disable-next-line
    ].map((_, x) =>
      rotatedLayout.map((row, y) =>
        rotateCell(row[x], x + tileX * 9, y + tileY * 9)
      )
    )
  }

  return {
    ...tile,
    layout: rotatedLayout,
  }
}
