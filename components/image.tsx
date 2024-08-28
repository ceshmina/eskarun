'use client'
import React from 'react'
import Zoom, { UncontrolledProps } from 'react-medium-image-zoom'
import { getCameraCaption } from '@/core/cameras'

const cx = (mods: Record<string, boolean>): string => {
  const cns: string[] = []
  Object.keys(mods).forEach(k => mods[k] && cns.push(k))
  return cns.join(' ')
}

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

    console.log(caption)
    
    return (<>
      {buttonUnzoom}
      <figure>
        {img}
        <figcaption className={classCaption}>
          {caption}
        </figcaption>
      </figure>
    </>)
  }

  return (<Zoom ZoomContent={CustomZoomContent}>
    <img src={src} className="my-2" />
  </Zoom>)
}
