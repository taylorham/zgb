import React from 'react'
import { Grid, Row } from 'react-bootstrap'
import { rotateTileCW } from '../Tiles/tile-utils'

const CELL_SIZE = 80
const BORDER_COLORS = {
  open: '#eee',
  wall: '#333',
  door: '#37f',
}
const ROOM_COLORS = [
  '#dfd',
  '#dff',
  '#ffd',
  '#fdf',
]
const STREET_COLORS = [
  '#ccc',
  '#d8d8d8',
  '#cfcfcf',
  '#dadada',
  '#d2d2d2',
  '#ddd',
  '#d5d5d5',
  '#dfdfdf',
]
const EXIT_ICONS = {
  north: 'glyphicon-arrow-up',
  east: 'glyphicon-arrow-right',
  south: 'glyphicon-arrow-down',
  west: 'glyphicon-arrow-left',
}

const Tile = ({ layout, rotate = 0 }) => {
  const renderCell = cell => {
    const bgColor = cell.hasOwnProperty('room') ? (
      ROOM_COLORS[cell.room]
    ) : cell.hasOwnProperty('street') ? (
      STREET_COLORS[cell.street]
    ) : (
      'initial'
    )
    let hasExit = false
    const renderIcon = () => {
      let iconClass = 'glyphicon'
      Object.keys(cell).forEach(key => {
        if (cell[key] === 'door') {
          hasExit = true
          iconClass+= ` ${EXIT_ICONS[key]}`
        }
      })
      if (hasExit) {
        const iconStyle = {
          fontSize: '16px',
          color: '#333',
          position: 'absolute',
          top: 'calc(50% - 8px)',
          left: 'calc(50% - 8px)',
        }
        return <i className={iconClass} style={iconStyle} />
      }
      return null
    }
    const style = {
      padding: `${CELL_SIZE * .39}px ${CELL_SIZE * .49}px`,
      lineHeight: `${CELL_SIZE}px`,
      maxWidth: CELL_SIZE,
      maxHeight: CELL_SIZE,
      position: 'relative',
      backgroundColor: bgColor,
      border: '3px solid transparent',
      borderTopColor: BORDER_COLORS[cell.north],
      borderRightColor: BORDER_COLORS[cell.east],
      borderBottomColor: BORDER_COLORS[cell.south],
      borderLeftColor: BORDER_COLORS[cell.west],
    }
    return (
      <span key={`col-${cell.coords[1]}`} style={style}>
         <span style={{fontSize: '1px', color: 'rgba(1,1,1,0)'}}>
           { '.' }
           { renderIcon() }
         </span>
      </span>
    )
  }

  return (
    <Grid style={{ paddingTop: '5px'}}>
      {
        rotateTileCW(layout, rotate).map((row, i) => (
          <Row key={`row-${i}`} style={{ margin: '-1px 0'}}>
            { row.map(renderCell) }
          </Row>
        ))
      }
    </Grid>
  )
}

export default Tile
