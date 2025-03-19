import Grid from './Grid'
import './Playground.css'

interface Props {
  score: number
}

function Playground({ score }: Props) {
  return (
    <div className='container'>
      <div className='score-area score'>
        {score >= 0 ? 'Score:' : ''}
        {score >= 0 ? <code className='score-value'>{score}</code> : null}
      </div>
      <div className='game-area'>
        <Grid />
      </div>
      <div className='score-area scoreboard'></div>
    </div>
  )
}

export default Playground
