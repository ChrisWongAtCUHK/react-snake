import { useSelector } from 'react-redux'
import { selectPlay } from './features/slices/playSlice'
import './App.css'
import Button from './components/Button'

function App() {
  const play = useSelector(selectPlay)

  function openPopup() {}
  return (
    <div className='page'>
      <h1 className='title'>SNAKE</h1>
      {play.isPlaying ? null : (
        <Button click={openPopup} title='How to play' className='button' />
      )}
    </div>
  )
}

export default App
