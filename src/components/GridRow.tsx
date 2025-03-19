import { useSelector } from 'react-redux'
import { selectPlay } from '../features/slices/playSlice'
import './GridRow.css'
import Cell from './Cell'

interface GridRowProps {
  coordinateY: number
  isFloorOrCeilingWall: boolean
}
function GridRow({ coordinateY, isFloorOrCeilingWall }: GridRowProps) {
  const play = useSelector(selectPlay)
  return (
    <>
      {play.grid.length > 0 ? (
        <div className='grid-row'>
          <Cell
            key='-1'
            coordinateX={-1}
            coordinateY={coordinateY}
            isWallCell={true}
          />
          {play.grid.map((cell, key) => {
            return (
              <Cell
                key={key}
                coordinateX={cell}
                coordinateY={coordinateY}
                isWallCell={isFloorOrCeilingWall}
              />
            )
          })}
          <Cell
            key={play.grid.length}
            coordinateX={play.grid.length}
            coordinateY={coordinateY}
            isWallCell={true}
          />
        </div>
      ) : null}
    </>
  )
}

export default GridRow
