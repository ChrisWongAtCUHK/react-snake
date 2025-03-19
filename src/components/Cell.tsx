import { useSelector } from 'react-redux'
import './Cell.css'
import { selectPlay } from '../features/slices/playSlice'
import { isSnake, isSnack } from '../utils'

interface CellProps {
  coordinateX: number
  coordinateY: number
  isWallCell: boolean
}
function Cell({ coordinateX, coordinateY, isWallCell }: CellProps) {
  const play = useSelector(selectPlay)

  function classNames() {
    const classes = ['grid-cell']
    
    if (play.snake?.coordinates) {
      if (isSnake([play.snake.coordinates[0]], coordinateX, coordinateY)) {
        classes.push('grid-cell-snake-head')
      }
    }

    if (play.snake?.coordinates) {
      if (isSnake(play.snake.coordinates, coordinateX, coordinateY)) {
        classes.push('grid-cell-snake')
      }
    }

    if (play.snack?.coordinate) {
      if (isSnack(coordinateX, coordinateY, play.snack)) {
        classes.push('grid-cell-snack')
      }
    }

    if (play.playground.isGameOver) {
      classes.push('grid-cell-game-over')
    }

    if (isWallCell) {
      classes.push('grid-cell-wall')
    }

    return classes.join(' ')
  }

  return <div className={classNames()} />
}

export default Cell
