import { MouseEvent } from 'react'
import './Button.css'

interface Props {
  click: (e: MouseEvent<HTMLButtonElement>) => void
  className?: string
  title: string
  style?: object
}

function Button(props: Props) {
  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    props.click(e)
  }
  return (
    <button className={props.className} onClick={handleClick} style={props.style}>
      {props.title}
    </button>
  )
}

export default Button
