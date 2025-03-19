import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import {
  selectPlay,
  setIsPlaying,
  setGrid,
  setSnake,
  setSnack,
  resetGamePlay,
  setGameOver,
  snakeMove,
  snakeChangeDirection,
} from './features/slices/playSlice'
import './App.css'
import Button from './components/Button'
import { Direction, GameRule } from './features/enums'
import { areSameCoordinates, isSnake } from './utils'
import HowToPlayPopup from './components/HowToPlayPopup'
import Playground from './components/Playground'

function App() {
  const GRID_SIZE = 35
  const DIRECTION_TICKS_WITHOUT_BORDERS = {
    UP: (x: number, y: number) => ({ x, y: y <= 0 ? GRID_SIZE - 1 : y - 1 }),
    DOWN: (x: number, y: number) => ({ x, y: y >= GRID_SIZE - 1 ? 0 : y + 1 }),
    RIGHT: (x: number, y: number) => ({ x: x >= GRID_SIZE - 1 ? 0 : x + 1, y }),
    LEFT: (x: number, y: number) => ({ x: x <= 0 ? GRID_SIZE - 1 : x - 1, y }),
  }
  const DIRECTION_TICKS_WITH_BORDERS = {
    UP: (x: number, y: number) => ({ x, y: y - 1 }),
    DOWN: (x: number, y: number) => ({ x, y: y + 1 }),
    RIGHT: (x: number, y: number) => ({ x: x + 1, y }),
    LEFT: (x: number, y: number) => ({ x: x - 1, y }),
  }
  const KEY_CODES_MAPPER: Record<string, Direction> = {
    ArrowUp: Direction.UP, // ARROW_UP Key
    w: Direction.UP, // W Key
    W: Direction.UP, // W Key

    ArrowRight: Direction.RIGHT, // ARROW_RIGHT Key
    d: Direction.RIGHT, // D Key
    D: Direction.RIGHT, // D Key

    ArrowLeft: Direction.LEFT, // ARROW_LEFT Key
    a: Direction.LEFT, // A Key
    A: Direction.LEFT, // A Key

    ArrowDown: Direction.DOWN, // ARROW_DOWN Key
    s: Direction.DOWN, // S Key
    S: Direction.DOWN, // S Key
  }
  const dispatch = useDispatch()
  const play = useSelector(selectPlay)
  const [isShowingHowToPlayPopup, setIsShowingHowToPlayPopup] = useState(false)
  const nodeRef = useRef(null)
  const snake = useRef(play.snake)
  const snakeHead = useRef(play.snake?.coordinates[0])
  const snakeTail = useRef(play.snake?.coordinates.slice(1))
  const score = useRef(play.snake?.coordinates?.length - 1)
  const snack = useRef(play.snack)
  const tickRate = useRef(play.tickRate)
  const currentDirection = useRef(play.playground.direction)

  // Interval variable (It will only run once)
  let interval = setInterval(() => {
    clearInterval(interval)
  }, 1)

  function openPopup() {
    if (!isShowingHowToPlayPopup) {
      setIsShowingHowToPlayPopup(() => true)
    }
  }

  function closePopup() {
    if (isShowingHowToPlayPopup) {
      setIsShowingHowToPlayPopup(() => false)
    }
  }

  function onStopGame() {
    clearInterval(interval)
    dispatch(setIsPlaying({ isPlaying: false }))
  }

  function resetGame() {
    dispatch(resetGamePlay())
  }

  function generateGrid() {
    const grid: number[] = []

    for (let i: number = 0; i < GRID_SIZE; i++) {
      grid.push(i)
    }

    dispatch(setGrid({ grid }))
  }

  function generateSnake() {
    const snake = {
      coordinates: [
        { x: Math.ceil(GRID_SIZE / 2), y: Math.ceil(GRID_SIZE / 2) },
      ],
    }

    dispatch(setSnake({ snake }))
  }

  function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  function getRandomCoordinate() {
    return {
      y: getRandomNumber(1, GRID_SIZE - 1),
      x: getRandomNumber(1, GRID_SIZE - 1),
    }
  }

  function getRandomSnackCoordinate() {
    let newCoordinate = getRandomCoordinate()

    if (
      play.snake?.coordinates.find((snakeCellCoordinate) =>
        areSameCoordinates(snakeCellCoordinate, newCoordinate)
      )
    )
      newCoordinate = getRandomSnackCoordinate()

    return newCoordinate
  }

  function generateSnack() {
    const snack = {
      coordinate: getRandomSnackCoordinate(),
    }

    dispatch(setSnack({ snack }))
  }

  function generateInitials() {
    resetGame()
    generateGrid()
    generateSnake()
    generateSnack()
  }

  function snakeHeadTouchesTail() {
    return isSnake(snakeTail.current, snakeHead.current?.x, snakeHead.current?.y)
  }

  function isSnakeOutside() {
    return (
      snakeHead.current?.x >= GRID_SIZE ||
      snakeHead.current?.y >= GRID_SIZE ||
      snakeHead.current?.x < 0 ||
      snakeHead.current?.y < 0
    )
  }

  function isSnakeEating() {
    return areSameCoordinates(snakeHead.current, snack.current?.coordinate)
  }

  function getSnakeTail() {
    return snake.current?.coordinates.slice(
      0,
      snake.current?.coordinates.length - 1
    )
  }

  function onTick(gameRule: GameRule) {
    if (
      snakeHeadTouchesTail() ||
      (gameRule === GameRule.WITH_BORDERS && isSnakeOutside())
    ) {
      dispatch(setGameOver())
      onStopGame()
    } else {
      dispatch(
        snakeMove({
          isSnakeEating: isSnakeEating(),
          directionTicks:
            gameRule === GameRule.WITHOUT_BORDERS
              ? DIRECTION_TICKS_WITHOUT_BORDERS
              : DIRECTION_TICKS_WITH_BORDERS,
          snakeHead: snakeHead.current,
          snakeTail: getSnakeTail(),
          snackRandomCoordinate: getRandomSnackCoordinate(),
        })
      )
    }
  }

  function onStartGame(gameRule: GameRule) {
    onStopGame()
    generateInitials()
    dispatch(setIsPlaying({ isPlaying: true }))

    interval = setInterval(() => {
      onTick(gameRule)
    }, tickRate.current)
  }

  useEffect(() => {
    function onChangeDirection(e: KeyboardEvent) {
      const newDirection = KEY_CODES_MAPPER[e.key]
      console.log(newDirection)

      // Prevent scrolling if the user pushed an arrow key for navigating the snake
      if (newDirection) e.preventDefault()
      if (!newDirection || newDirection === currentDirection.current) {
        return
      }
      dispatch(snakeChangeDirection({ direction: newDirection }))
    }
    window.addEventListener('keydown', onChangeDirection)

    return () => {
      window.removeEventListener('keydown', onChangeDirection)
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    snake.current = play.snake
    snakeHead.current = play.snake?.coordinates[0]
    snakeTail.current = play.snake?.coordinates.slice(1)
    score.current = play.snake?.coordinates?.length - 1
  }, [play.snake])

  return (
    <div className='page'>
      <h1 className='title'>SNAKE</h1>
      {play.isPlaying ? null : (
        <Button click={openPopup} title='How to play' className='button' />
      )}
      {play.isPlaying ? null : (
        <Button
          click={() => onStartGame(GameRule.WITHOUT_BORDERS)}
          title='Play without borders'
          className='button button-play'
        />
      )}
      {play.isPlaying ? null : (
        <Button
          click={() => onStartGame(GameRule.WITH_BORDERS)}
          title='Play with borders'
          className='button button-play'
        />
      )}
      {play.isPlaying ? (
        <Button
          click={onStopGame}
          title='Stop'
          style={{ marginBottom: '20px'}}
        />
      ) : null}
      <CSSTransition
        in={isShowingHowToPlayPopup}
        nodeRef={nodeRef}
        timeout={550}
        classNames='modal'
        unmountOnExit
      >
        <div ref={nodeRef} className='modal-mask'>
          <HowToPlayPopup close={closePopup} />
        </div>
      </CSSTransition>
      <Playground score={score.current} />
    </div>
  )
}

export default App
