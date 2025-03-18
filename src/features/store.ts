import { configureStore } from '@reduxjs/toolkit'
import playSlice from './slices/playSlice'

const store = configureStore({
  reducer: {
    play: playSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>

export default store
