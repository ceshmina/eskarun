'use client'
import React from 'react'
import Zoom, { UncontrolledProps } from 'react-medium-image-zoom'
import { cx } from '@/core/utils'

export default async function Image({ src, caption }: Readonly<{ src: string, caption: string }>) {
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
          <p dangerouslySetInnerHTML={{ __html: caption }} />
        </figcaption>
      </figure>
    </>)
  }

  return (<Zoom ZoomContent={CustomZoomContent}>
    <img src={src} />
  </Zoom>)
}
