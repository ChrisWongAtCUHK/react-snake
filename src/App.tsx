import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import { selectPlay } from './features/slices/playSlice'
import './App.css'
import Button from './components/Button'
import HowToPlayPopup from './components/HowToPlayPopup'

function App() {
  const play = useSelector(selectPlay)
  const [isShowingHowToPlayPopup, setIsShowingHowToPlayPopup] = useState(false)
  const nodeRef = useRef(null)

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

  return (
    <div className='page'>
      <h1 className='title'>SNAKE</h1>
      {play.isPlaying ? null : (
        <Button click={openPopup} title='How to play' className='button' />
      )}
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
    </div>
  )
}

export default App
