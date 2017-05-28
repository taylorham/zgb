import React, { Component } from 'react'
import { buildTile } from './utils/tile-utils'
import Tile from './Tiles/Tile'
import Mission01 from './Missions/Mission01'

class App extends Component {
  state = {
    mission: Mission01,
  }

  render() {
    return (
      <div style={{ width: '2568px', transform: 'scale(.33)', margin: '-508px -857px' }}>
        {
          this.state.mission.map((row, i) => {
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
