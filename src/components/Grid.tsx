import { useSelector } from 'react-redux'
import { selectPlay } from '../features/slices/playSlice'
import GridRow from './GridRow'

function Grid() {
  const play = useSelector(selectPlay)

  return (
    <div className='game-grid'>
      <GridRow key={-1} coordinateY={-1} isFloorOrCeilingWall={true} />
      {play.grid.map((row, key) => {
        return (
          <GridRow key={key} coordinateY={row} isFloorOrCeilingWall={false} />
        )
      })}
      <GridRow key={play.grid.length} coordinateY={play.grid.length} isFloorOrCeilingWall={true} />
    </div>
  )
}

export default Grid
