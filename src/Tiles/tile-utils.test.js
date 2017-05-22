import { rotateTileCW } from './tile-utils'
import C2, { rotatedC2 } from './C2'

jest.unmock('./tile-utils')

describe('rotateTileCW', () => {
  it('should rotate correctly', () => {
    expect(rotateTileCW(C2, 1)).toEqual(rotatedC2)
  })
})


