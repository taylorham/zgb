import { buildTile } from './tile-utils'

const C2 = buildTile({
  vertical: [
    ['0,-1', 6, [1, 4]],
    ['0,2', 6, [1, 4]],
    ['0,5', 6],
  ],
  horizontal: [
    ['-1,0', 6, [1, 4]],
    ['2,0', 6, [1, 5]],
    ['5,0', 6],
  ],
})

export default C2

export const rotatedC2 = buildTile({
  vertical: [
    ['0,2', 6],
    ['0,5', 6, [1, 5]],
    ['0,8', 6, [1, 4]],
  ],
  horizontal: [
    ['-1,3', 6, [1, 4]],
    ['2,3', 6, [1, 4]],
    ['5,3', 6]
  ],
})
