import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../store'

const initialState = {
  isPlaying: false
}

const playSlice = createSlice({
  name: 'play',
  initialState,
  reducers: {
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload.isPlaying
    }
  }
})

export const selectPlay = (state : RootState) => state.play

export const { setIsPlaying } = playSlice.actions

export default playSlice.reducer

