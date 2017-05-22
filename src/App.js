import React, { Component } from 'react'
import Tile from './Tile/Tile'
import C2 from './Tiles/C2'

class App extends Component {
  state = {
    rotation: 0
  }
  render() {
    return (
      <Tile
        layout={C2}
        rotate={this.state.rotation}
      />
    )
  }
}

export default App
