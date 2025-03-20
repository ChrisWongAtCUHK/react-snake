import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { Direction } from '../enums'
import { ISnake, ISnack } from '../interfaces'
import { areSameCoordinates, areOppositeDirections } from '../../utils'

const initialState = {
  playground: {
    direction: Direction.RIGHT,
    isGameOver: false,
  },
  isPlaying: false,
  grid: [] as number[],
  snake: undefined as unknown as ISnake,
  snack: undefined as unknown as ISnack,
  tickRate: 150,
}

const playSlice = createSlice({
  name: 'play',
  initialState,
  reducers: {
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload.isPlaying
      return state
    },
    setGrid: (state, action) => {
      state.grid = [...action.payload.grid] as number[]
      return state
    },
    setSnake: (state, action) => {
      state.snake = action.payload.snake
      return state
    },
    setSnack: (state, action) => {
      state.snack = action.payload.snack
      return state
    },
    resetGamePlay: (state) => {
      state.grid = []
      state.snake = undefined as unknown as ISnake
      state.snack = undefined as unknown as ISnack
      state.playground.isGameOver = false
      
      return state
    },
    setGameOver: (state) => {
      state.playground.isGameOver = true
      return state
    },
    snakeMove: (state, action) => {
      if (!state.snake) return state
      if (!state.snack) return state

      const isSnakeEating = action.payload.isSnakeEating
      if (isSnakeEating) {
        state.tickRate += 1
      }

      const snakeHead_new = action.payload.directionTicks[
        state.playground.direction
      ](action.payload.snakeHead?.x, action.payload.snakeHead?.y)
      const snakeNeck = state.snake.coordinates[1]

      const snakeHead =
        !snakeNeck || !areSameCoordinates(snakeHead_new, snakeNeck)
          ? snakeHead_new
          : action.payload.snakeHead?.x > snakeNeck.x
          ? action.payload.directionTicks[Direction.RIGHT](
              action.payload.snakeHead?.x,
              action.payload.snakeHead?.y
            )
          : action.payload.snakeHead?.x < snakeNeck.x
          ? action.payload.directionTicks[Direction.LEFT](
              action.payload.snakeHead?.x,
              action.payload.snakeHead?.y
            )
          : action.payload.snakeHead?.y > snakeNeck.y
          ? action.payload.directionTicks[Direction.DOWN](
              action.payload.snakeHead?.x,
              action.payload.snakeHead?.y
            )
          : action.payload.directionTicks[Direction.UP](
              action.payload.snakeHead?.x,
              action.payload.snakeHead?.y
            )

      const snakeTail = isSnakeEating
        ? state.snake.coordinates
        : action.payload.snakeTail
      const snackCoordinate = isSnakeEating
        ? action.payload.snackRandomCoordinate
        : state.snack.coordinate

      state.snake.coordinates = [snakeHead, ...snakeTail]
      state.snack.coordinate = snackCoordinate

      return state
    },
    snakeChangeDirection: (state, action) => {
      if (!areOppositeDirections(state.playground.direction, action.payload.direction)) {
        state.playground.direction = action.payload.direction 
      }
      return state
    },
  },
})

export const selectPlay = (state: RootState) => state.play

export const {
  setIsPlaying,
  setGrid,
  setSnake,
  setSnack,
  resetGamePlay,
  setGameOver,
  snakeMove,
  snakeChangeDirection,
} = playSlice.actions

export default playSlice.reducer
