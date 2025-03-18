import { MouseEvent } from 'react'
import './Button.css'

interface Props {
  click: (e: MouseEvent<HTMLButtonElement>) => void
  className: string
  title: string
}

function Button(props: Props) {
  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    props.click(e)
  }
  return (
    <button className={props.className} onClick={handleClick}>
      {props.title}
    </button>
  )
}

export default Button
