'use client'
import React from 'react'
import Link from 'next/link'
import Zoom, { UncontrolledProps } from 'react-medium-image-zoom'
import { cx } from '@/core/utils'

export default function Thumbnail({ src, date, title }: Readonly<{ src: string, date: string, title: string }>) {
  const CustomZoomContent: UncontrolledProps['ZoomContent'] = ({ buttonUnzoom, modalState, img }) => {
    const [isLoaded, setIsLoaded] = React.useState(false)
    const imgProps = (img as React.ReactElement<HTMLImageElement>)?.props
    const imgWidth = imgProps?.width
    const imgHeight = imgProps?.height
    const classCaption = React.useMemo(() => {
      const hasWidthHeight = imgWidth != null && imgHeight != null
      const imgRatioLargerThanWindow = imgWidth / imgHeight > window.innerWidth / window.innerHeight
      return cx({
        'zoom-caption': true,
        'zoom-caption--loaded': isLoaded,
        'zoom-caption--bottom': hasWidthHeight && imgRatioLargerThanWindow,
        'zoom-caption--left': hasWidthHeight && !imgRatioLargerThanWindow,
      })
    }, [imgWidth, imgHeight, isLoaded])

    React.useLayoutEffect(() => {
      if (modalState === 'LOADED') {
        setIsLoaded(true)
      } else if (modalState === 'UNLOADING') {
        setIsLoaded(false)
      }
    }, [modalState])
    
    return (<>
      {buttonUnzoom}
      <figure>
        {img}
        <figcaption className={classCaption}>
          <p>
            <Link href={`/articles/${date}`} className="text-blue-300">{title}</Link>より
          </p>
        </figcaption>
      </figure>
    </>)
  }
  return (
    <Zoom ZoomContent={CustomZoomContent} zoomImg={{ src: src.replace('thumbnail', 'medium') }}>
      <img src={src} loading='lazy' className='aspect-square object-cover'/>
    </Zoom>
  )
}
