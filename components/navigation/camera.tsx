'use client'
import { useState, MouseEvent } from 'react'
import Link from 'next/link'
import { GoTriangleDown, GoTriangleUp } from 'react-icons/go'

type Props = Readonly<{
  title: string
  cameras: ReadonlyArray<{
    camera: string
    count: number
  }>
  isFirstOpen: boolean
}>

export default function Camera({ title, cameras, isFirstOpen }: Props) {
  const [isOpen, setIsOpen] = useState(isFirstOpen)
  const toggleOpen = (event: MouseEvent) => {
    event.stopPropagation()
    setIsOpen(!isOpen)
  }

  return (
    <div className="my-1 text-sm font-bold">
      <p className="mb-2" onClick={toggleOpen}>
        {title} {isOpen ?
          <GoTriangleUp className="text-lg inline-block" /> :
          <GoTriangleDown className="text-lg inline-block" />
        }
      </p>
      {isOpen && <ul className="mt-2 mb-4 ml-4">
        {cameras.map(({ camera, count }) => {
          return (<li key={camera} className="my-1 text-sm font-normal">
            <Link href={`/cameras/${camera}`} className="text-blue-300">{camera} ({count})</Link>
          </li>)
        })}
      </ul>}
    </div>
  )
}
