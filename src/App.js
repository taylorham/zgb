import React, { Component } from 'react'
import { buildTile } from './Tiles/tile-utils'
import Tile from './Tile/Tile'
import B1 from './Tiles/B1'
import B4 from './Tiles/B4'
import B6 from './Tiles/B6'
import B7 from './Tiles/B7'
import C1 from './Tiles/C1'
import C2 from './Tiles/C2'
import C5 from './Tiles/C5'
import D5 from './Tiles/D5'
import E5 from './Tiles/E5'

class App extends Component {
  state = {
    grid: [
      [
        {
          tile: C2,
          rotation: 1,
        },
        {
          tile: C1,
          rotation: 2,
        },
        {
          tile: B4,
          rotation: 1,
        }
      ],
      [
        {
          tile: C5,
          rotation: 3,
        },
        {
          tile: B7,
          rotation: 0,
        },
        {
          tile: D5,
          rotation: 1,
        }
      ],
      [
        {
          tile: B6,
          rotation: 1,
        },
        {
          tile: E5,
          rotation: 0,
        },
        {
          tile: B1,
          rotation: 3,
        }
      ]
    ],
  }

  render() {
    return (
      <div style={{ width: '2568px', transform: 'scale(.33)', margin: '-508px -857px' }}>
        {
          this.state.grid.map((row, i) => {
            const length = row.length
            return (
              <div key={i} style={{ clear: 'both' }}>
                {
                  row.map((cell, j) => (
                    <Tile
                      key={(i * length) + j}
                      layout={buildTile(cell.tile, cell.rotation).layout}
                    />
                  ))
                }
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default App
