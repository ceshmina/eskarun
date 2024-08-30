'use client'
import Zoom from 'react-medium-image-zoom'

export default function Thumbnail({ src }: Readonly<{ src: string }>) {
  return (
    <Zoom>
      <img src={src} className='aspect-square object-cover'/>
    </Zoom>
  )
}
