import { buildTile } from './tile-utils'
import { C2, rotatedC2 } from '../Tiles/Tiles'

jest.unmock('./tile-utils')

describe('rotateTile', () => {
  it('should rotate correctly', () => {
    expect(buildTile(C2, 1).layout).toEqual(buildTile(rotatedC2).layout)
    expect(buildTile(C2, 2).layout).toEqual(buildTile(rotatedC2, 1).layout)
  })
})
