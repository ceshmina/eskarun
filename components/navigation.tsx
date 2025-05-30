import Link from 'next/link'
import { aggArticlesByMonth, aggArticlesByCamera, aggArticlesByLocation } from '@/core/aggregate'
import Year from '@/components/navigation/year'

export default async function Navigation() {
  const articlesByMonth = await aggArticlesByMonth()
  const articlesByCamera = await aggArticlesByCamera()
  const articlesByLocation = await aggArticlesByLocation()
  return (
    <div>
      <div>
        <h2 className="text-lg font-bold">月別</h2>
        <ul className="my-4">
          {articlesByMonth.map(({ year, months }, index) => (
            <Year key={year} year={year} months={months} showOrder={index} />
          ))}
        </ul>
      </div>

      <div className="mt-12">
        <h2 className="text-lg font-bold">場所別</h2>
        <ul className="my-4">
          <li className="my-1 text-sm font-bold">
            日本
            <ul className="mt-2 mb-4 ml-4">
              {articlesByLocation.japan.map(({ location, count }) => {
                return (<li key={location} className="my-1 text-sm font-normal">
                  <Link href={`/locations/${location}`} className="text-blue-300">{location} ({count})</Link>
                </li>)
              })}
            </ul>
          </li>
          <li className="my-1 text-sm font-bold">
            海外
            <ul className="mt-2 mb-4 ml-4">
              {articlesByLocation.other.map(({ location, count }) => {
                return (<li key={location} className="my-1 text-sm font-normal">
                  <Link href={`/locations/${location}`} className="text-blue-300">{location} ({count})</Link>
                </li>)
              })}
            </ul>
          </li>
        </ul>
      </div>

      <div className="mt-12">
        <h2 className="text-lg font-bold">撮影機材別</h2>
        <ul className="my-4">
          <li className="my-1 text-sm font-bold">
            カメラ
            <ul className="mt-2 mb-4 ml-4">
              {articlesByCamera.cameras.map(({ camera, count }) => (
                <li key={camera} className="my-1 text-sm font-normal">
                  <Link href={`/cameras/${camera}`} className="text-blue-300">{camera} ({count})</Link>
                </li>
              ))}
            </ul>
          </li>
          <li className="my-1 text-sm font-bold">
            レンズ
            <ul className="mt-2 mb-4 ml-4">
              {articlesByCamera.lenses.map(({ camera, count }) => (
                <li key={camera} className="my-1 text-sm font-normal">
                  <Link href={`/cameras/${camera}`} className="text-blue-300">{camera} ({count})</Link>
                </li>
              ))}
            </ul>
          </li>
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
