import React from 'react'
import { buildMission } from '../utils/mission-utils'
import Tile from '../Tiles/Tile'

const Mission = ({ mission }) => {
  const { layout } = buildMission(mission)
  const renderLayout = []

  mission.layout.forEach((gridRow, gridX) => {
    const layoutRow = []
    gridRow.forEach((gridTile, gridY) => {
      const tile = []
      let i = 9
      while (i--) {
        let tileRow = layout[i + (gridX * 9)].slice(gridY * 9, (gridY * 9) + 9)
        tile.unshift(tileRow)
      }

      layoutRow.push(
        <Tile
          key={gridY}
          layout={tile}
        />
      )
    })

    renderLayout.push(
      <div key={gridX} style={{clear: 'both'}}>
        { layoutRow }
      </div>
    )
  })

  return (
    <div style={{ width: '2568px', transform: 'scale(.33)', margin: '-508px -857px' }}>
      { renderLayout }
    </div>
  )
}

export default Mission
