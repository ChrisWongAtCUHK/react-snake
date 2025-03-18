import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectPlay } from './features/slices/playSlice'
import './App.css'
import Button from './components/Button'
import HowToPlayPopup from './components/HowToPlayPopup'

function App() {
  const play = useSelector(selectPlay)
  const [isShowingHowToPlayPopup, setIsShowingHowToPlayPopup] = useState(false)

  function openPopup() {
    if(!isShowingHowToPlayPopup) {
      setIsShowingHowToPlayPopup(() => true)
    }
  }

  function closePopup() {
    if(isShowingHowToPlayPopup) {
      setIsShowingHowToPlayPopup(() => false)
    }
  }

  return (
    <div className='page'>
      <h1 className='title'>SNAKE</h1>
      {play.isPlaying ? null : (
        <Button click={openPopup} title='How to play' className='button' />
      )}
      {isShowingHowToPlayPopup ? <HowToPlayPopup close={closePopup} /> : null}
    </div>
  )
}

export default App
