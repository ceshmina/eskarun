import Link from 'next/link'
import { parse, format } from 'date-fns'
import { aggArticlesByMonth, aggArticlesByCamera, aggArticlesByLocation } from '@/core/aggregate'

export default async function Navigation() {
  const articlesByMonth = await aggArticlesByMonth()
  const articlesByCamera = await aggArticlesByCamera()
  const articlesByLocation = await aggArticlesByLocation()
  return (
    <div>
      <div>
        <h2 className="text-lg font-bold">月別</h2>
        <ul className="my-4">
          {articlesByMonth.map(({ year, months }) => {
            const formatYear = format(parse(year, 'yyyy', new Date()), 'yyyy年')
            return (<li key={year} className="my-1 text-sm font-bold">
              {formatYear}
              <ul className="mt-2 mb-4 ml-4">
                {months.map(({ month, count }) => {
                  const formatMonth = format(parse(month, 'yyyyMM', new Date()), 'yyyy年M月')
                  return (<li key={month} className="my-1 text-sm font-normal">
                    <Link href={`/months/${month}`} className="text-blue-300">{formatMonth} ({count})</Link>
                  </li>)
                })}
              </ul>
            </li>)
          })}
        </ul>
      </div>

      <div className="mt-12">
        <h2 className="text-lg font-bold">場所別</h2>
        <ul className="my-4">
          {articlesByLocation.map(({ location, count }) => {
            return (<li key={location} className="my-1 text-sm font-normal">
              <Link href={`/locations/${location}`} className="text-blue-300">{location} ({count})</Link>
            </li>)
          })}
        </ul>
      </div>

      <div className="mt-12">
        <h2 className="text-lg font-bold">撮影機材別</h2>
        <ul className="my-4">
          {articlesByCamera.map(({ camera, count }) => {
            return (<li key={camera} className="my-1 text-sm font-normal">
              <Link href={`/cameras/${camera}`} className="text-blue-300">{camera} ({count})</Link>
            </li>)
          })}
        </ul>
      </div>

      <div className="mt-12 mb-16">
        <h2 className="text-base font-bold">
          <Link href="/photos" className="text-blue-300">すべての写真</Link>
        </h2>
      </div>
    </div>
  )
}
