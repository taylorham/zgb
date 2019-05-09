import { B1, B4, B6, B7, C1, C2, C5, D5, E5 } from '../Tiles/Tiles'

export const Mission01 = {
  layout: [
    [
      { tile: C2, rotation: 1, doors: ['5,6'] },
      { tile: C1, rotation: 2, doors: ['4,2'] },
      { tile: B4, rotation: 1, doors: ['6,4'] },
    ],
    [
      { tile: C5, rotation: 3, doors: ['6,3'] },
      { tile: B7, rotation: 0, doors: ['2,5', '6,3'] },
      { tile: D5, rotation: 1, doors: ['2,4'] },
    ],
    [
      { tile: B6, rotation: 1, doors: ['2,5'] },
      { tile: E5, rotation: 0, doors: ['6,4'] },
      { tile: B1, rotation: 3, doors: ['2,4'] },
    ],
  ],
  // playerStart = [{missionTileCoords}, {roomNWCornerCoords}]
  playerStart: ['1,1', '2,2'],
  // zombieSpawn = [{missionTileCoords}, {cornerString}]
  zombieSpawns: [['0,0', 'ne'], ['0,2', 'se'], ['0,1', 'sw'], ['2,1', 'se']],
  // objective = [{missionTileCoords}, {roomNWCornerCoords}]
  objectives: [],
}
