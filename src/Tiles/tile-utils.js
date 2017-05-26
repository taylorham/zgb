export const buildTile = (walls, rotation = 0) => {
  return markStreets(markRooms(rotateTile(buildWalls(walls), rotation)))
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

  vertical.forEach(wall => {
    const [startX, startY] = wall[0].split(',').map(item => parseInt(item, 10))
    const doorwayLocations = typeof wall[2] !== 'undefined' && (Array.isArray(wall[2]) ? [...wall[2]] : [wall[2]])

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

  const wallCrawler = (coords, roomIndex, origin = '0,0') => {
    const x = parseInt(coords[0], 10)
    const y = parseInt(coords[2], 10)
    const newOrigin = `${x},${y}`
    const cell = updatedLayout[x][y]
    const newDirections = {
      north: `${x - 1},${y}`,
      east: `${x},${y + 1}`,
      south: `${x + 1},${y}`,
      west: `${x},${y - 1}`,
    }
    const canGo = (direction) => {
      const newCell = updatedLayout[newDirections[direction][0]][newDirections[direction][2]]

      return (
        !newCell.hasOwnProperty('room') &&
        cell[direction] === 'open' &&
        newDirections[direction] !== origin
      )
    }
    const nextCoords = []

    if (!cell.hasOwnProperty('room')) {
      cell.room = roomIndex
      if (x > 0 && canGo('north')) nextCoords.push(newDirections.north)
      if (y < 8 && canGo('east')) nextCoords.push(newDirections.east)
      if (x < 8 && canGo('south')) nextCoords.push(newDirections.south)
      if (y > 0 && canGo('west')) nextCoords.push(newDirections.west)

      nextCoords.forEach(nextCoord => wallCrawler(nextCoord, roomIndex, newOrigin))
    }

    return false
  }

  NWCorners.forEach((cell, i) => {
    wallCrawler(cell, i)
  })

  return {
    ...tile,
    layout: updatedLayout
  }
}

function markStreets(tile) {
  const { layout } = tile
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
    doors: tile.doors,
    layout: rotatedLayout
  }
}
