import React from 'react'

const CELL_SIZE = 80
const BORDER_COLORS = {
  open: '#eee',
  wall: '#333',
  door: '#37f',
}
const ROOM_COLORS = ['#dfd', '#dff', '#ffd', '#fdd']
const STREET_COLORS = ['#bbb', '#bbb', '#d3d3d3']
const EXIT_ICONS = {
  north: 'glyphicon-arrow-up',
  east: 'glyphicon-arrow-right',
  south: 'glyphicon-arrow-down',
  west: 'glyphicon-arrow-left',
}
const CARDINALS = ['north', 'east', 'south', 'west']

export const Tile = ({ layout }) => {
  const modCoords = cell => {
    const {
      coords: [originalX, originalY],
    } = cell
    return {
      x: originalX - Math.floor(originalX / 9) * 9,
      y: originalY - Math.floor(originalY / 9) * 9,
    }
  }
  const markSidewalks = cell => {
    const { x, y } = modCoords(cell)
    const checkCorner = {
      nw:
        x > 0 && y > 0 && x % 3 === 0 && y % 3 === 0
          ? `${x - 1},${y - 1}`
          : false,
      ne:
        x > 0 && y < 8 && x % 3 === 0 && y % 3 === 2
          ? `${x - 1},${y + 1}`
          : false,
      sw:
        x < 8 && y > 0 && x % 3 === 2 && y % 3 === 0
          ? `${x + 1},${y - 1}`
          : false,
      se:
        x < 8 && y < 8 && x % 3 === 2 && y % 3 === 2
          ? `${x + 1},${y + 1}`
          : false,
    }
    const [isCorner] = Object.keys(checkCorner).filter(
      direction => checkCorner[direction]
    )
    if (CARDINALS.some(direction => cell[direction] === 'wall')) {
      return [STREET_COLORS[2]]
    } else if (isCorner) {
      const [newX, newY] = checkCorner[isCorner].split(',')
      if (
        CARDINALS.some(direction => layout[newX][newY][direction] === 'wall')
      ) {
        return [STREET_COLORS[2]]
      }
    } else if ([x, y].map(v => [2, 6].includes(v))) {
      return markCrosswalks(cell)
    }
    return STREET_COLORS[cell.street % 2]
  }

  let addToStyle = {}

  function markCrosswalks(cell) {
    const { x, y } = modCoords(cell)
    const streetColor = STREET_COLORS[0]
    let streetBG = streetColor

    if ([2, 6].includes(x)) {
      addToStyle.backgroundSize = '33.3% 100%'
      streetBG = `linear-gradient(to right, ${streetColor}, ${streetColor} 25%, #f2f2f2 25%, #f2f2f2 75%, ${streetColor} 75%)`
    } else if ([2, 6].includes(y)) {
      addToStyle.backgroundSize = '100% 33.3%'
      streetBG = `linear-gradient(to bottom, ${streetColor}, ${streetColor} 25%, #f2f2f2 25%, #f2f2f2 75%, ${streetColor} 75%)`
    }
    return streetBG
  }

  const renderCell = cell => {
    const bgColor = cell.hasOwnProperty('room')
      ? ROOM_COLORS[cell.room]
      : !cell.hasOwnProperty('room')
      ? markSidewalks(cell)
      : 'initial'

    let hasExit = false
    const renderIcon = () => {
      let iconClass = 'glyphicon'

      Object.keys(cell).forEach(key => {
        if (cell[key] === 'door') {
          hasExit = true
          iconClass += ` ${EXIT_ICONS[key]}`
        } else if (cell.hasOwnProperty('manhole')) {
          hasExit = true
          iconClass += ` glyphicon-cd`
        }
      })
      if (hasExit) {
        const iconStyle = {
          fontSize: '36px',
          color: '#333',
          position: 'absolute',
          top: 'calc(50% - 18px)',
          left: 'calc(50% - 18px)',
        }
        return <i className={iconClass} style={iconStyle} />
      }
      return null
    }
    const style = {
      padding: `${CELL_SIZE * 0.39}px ${CELL_SIZE * 0.49}px`,
      lineHeight: `${CELL_SIZE}px`,
      maxWidth: CELL_SIZE,
      maxHeight: CELL_SIZE,
      position: 'relative',
      background: bgColor,
      border: '3px solid transparent',
      borderTopColor: BORDER_COLORS[cell.north],
      borderRightColor: BORDER_COLORS[cell.east],
      borderBottomColor: BORDER_COLORS[cell.south],
      borderLeftColor: BORDER_COLORS[cell.west],
      ...addToStyle,
    }
    return (
      <span key={`col-${cell.coords[1]}`} style={style}>
        <span style={{ fontSize: '1px', color: 'rgba(255,255,255,0)' }}>
          {'.'}
          {renderIcon()}
        </span>
      </span>
    )
  }

  return (
    <span style={{ margin: '4px 1px', width: '762px', float: 'left' }}>
      {layout.map((row, i) => (
        <div key={`row-${i}`} style={{ margin: '-1px 0' }}>
          {row.map(renderCell)}
        </div>
      ))}
    </span>
  )
}
