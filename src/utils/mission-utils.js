import { buildTile } from './tile-utils'

export const buildMission = (mission) => {
  let gridLengthX = mission.layout.length
  let missionLayout = []

  let i = gridLengthX * 9

  while (i--) {
    missionLayout.push([])
  }

  mission.layout.forEach((tileRow, tileX) => {
    tileRow.forEach((tile, tileY) => {
      const builtTile = buildTile([tileX, tileY], tile)
      builtTile.layout.forEach((gridRow, gridX) => {
        missionLayout[gridX + (tileX * 9)].push(...gridRow)
      })
    })
  })

  return {
    layout: missionLayout
  }
}

// export const markStreets = (mission) => {
//   const possibleStreets = ['0,0', '0,3', '0,6', '3,0', '3,6', '6,0', '6,3', '6,6',]
//   const missionCrawler = (tile = '0,0', coords = '0,0', roomIndex = 0, origin = '0,0') => {
//     const x = parseInt(coords[0], 10)
//     const y = parseInt(coords[2], 10)
//
//     const newOrigin = [x, y]
//
//     const cell = updatedLayout[x][y]
//     const nextCell = {
//       north: [x - 1, y],
//       east: [x, y + 1],
//       south: [x + 1, y],
//       west: [x, y - 1],
//     }
//     const canGo = (direction) => {
//       const [ nextX, nextY ] = nextCell[direction]
//       const newCell = updatedLayout[nextX][nextY]
//
//       return (
//         newCell.hasOwnProperty('street') &&
//         cell[direction] !== 'wall' &&
//         nextCell[direction] !== origin
//       )
//     }
//     const nextCoords = []
//
//     if (cell.hasOwnProperty('street')) {
//       cell.street = streetIndex
//       if (x > 0 && canGo('north')) nextCoords.push(nextCell.north)
//       if (y < 8 && canGo('east')) nextCoords.push(nextCell.east)
//       if (x < 8 && canGo('south')) nextCoords.push(nextCell.south)
//       if (y > 0 && canGo('west')) nextCoords.push(nextCell.west)
//
//       nextCoords.forEach(nextCoord => missionCrawler(nextCoord.join(','), roomIndex, newOrigin.join(',')))
//     }
//
//     return false
//   }
// }

export const pathfinder = (origin, targets) => {
  // TODO: Crawl tiles and add new unique rooms to arrays
  // When one room encounters more than one adjacent room, create a new array.
  // Compare the length of arrays once all paths to the target have been found, and return
  // the first room from the shortest array as the room to move a zombie to.
}

export const missionMarkers = (layout) => {
  // TODO: Once `markStreets` is implemented, lay down mission markers
}
