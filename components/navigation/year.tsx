'use client'
import { useState, MouseEvent } from 'react'
import Link from 'next/link'
import { GoTriangleDown, GoTriangleUp } from 'react-icons/go'
import { parse, format } from 'date-fns'

type Props = Readonly<{
  year: string
  months: ReadonlyArray<{ month: string, count: number }>
  showOrder?: number
}>

export default function Year({ year, months, showOrder }: Props) {
  const formatYear = format(parse(year, 'yyyy', new Date()), 'yyyy年')
  const countSum = months.reduce((acc, { count }) => acc + count, 0)

  const [isOpen, setIsOpen] = useState(!showOrder)
  const toggleOpen = (event: MouseEvent) => {
    event.stopPropagation()
    setIsOpen(!isOpen)
  }

  return (<li key={year} className="my-1 text-sm font-bold">
    <p className="mb-2" onClick={toggleOpen}>
      {formatYear} ({countSum}) {isOpen ?
        <GoTriangleUp className="text-lg inline-block" /> :
        <GoTriangleDown className="text-lg inline-block" />
      }
    </p>
    {isOpen && <ul className="mt-2 mb-4 ml-4">
      {months.map(({ month, count }) => {
        const formatMonth = format(parse(month, 'yyyyMM', new Date()), 'yyyy年M月')
        return (<li key={month} className="my-1 text-sm font-normal">
          <Link href={`/months/${month}`} className="text-blue-300">{formatMonth} ({count})</Link>
        </li>)
      })}
    </ul>}
  </li>)
}
