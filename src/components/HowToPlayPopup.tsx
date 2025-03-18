import { MouseEvent, useEffect, useMemo, useState } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import './HowToPlayPopup.css'
import Button from './Button'

interface Props {
  close: (e: MouseEvent<HTMLButtonElement>) => void
}
function HowToPlayPopup(props: Props) {
  const [howToPlayMarkdownHTML, setHowToPlayMarkdownHTML] = useState('Loading')
  const url = './HOW_TO_PLAY.md'
  const myRequest = useMemo(
    () =>
      new Request(url, {
        headers: new Headers({ accept: 'application/vnd.github.v3.raw' }),
      }),
    []
  )

  useEffect(() => {
    fetch(myRequest)
      .then((response: Response) => {
        if (response.ok) return response.text()
        throw new Error(
          '**There was error fetching the [`HOW_TO_PLAY.md`](./HOW_TO_PLAY.md) from public.**'
        )
      })
      .catch((error: Error) => {
        return error.message
      })
      .then((text: string) => {
        setHowToPlayMarkdownHTML(() => DOMPurify.sanitize(marked(text)))
      })
  }, [myRequest])

  return (
    <div className='modal-mask'>
      <div className='modal-wrapper'>
        <div className='modal-container'>
          <div className='modal-description'>
            <div dangerouslySetInnerHTML={{ __html: howToPlayMarkdownHTML }} />
          </div>
          <div className='modal-footer'>
            <Button
              className='modal-default-button'
              title='Close'
              click={props.close}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowToPlayPopup
