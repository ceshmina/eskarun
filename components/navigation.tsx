import { aggArticlesByMonth } from '@/core/aggregate'
import Year from '@/components/navigation/year'

export default async function Navigation() {
  const articlesByMonth = await aggArticlesByMonth()
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
    </div>
  )
}
