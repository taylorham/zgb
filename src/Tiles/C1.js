import { buildTile } from './tile-utils'

const C1 = buildTile({
  vertical: [
    ['0,2', 6],
    ['0,5', 3, 1],
    ['0,8', 6, [1, 4]],
  ],
  horizontal: [
    ['-1,3', 6, [1, 4]],
    ['2,3', 6, [1, 3]],
    ['5,3', 6],
  ]
})

export default C1
