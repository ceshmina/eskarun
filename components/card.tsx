import Link from 'next/link'
import { Article } from '@/core/articles'

export default function ArticleCard({ article }: Readonly<{ article: Article }>) {
  const { slug, content } = article
  const title = article.formatTitle()
  const thumbnailUrls = article.thumbnailUrls()

  return (
    <div key={slug} className="my-8">
      <h2 className="my-2 text-lg font-bold">
        <Link href={`/articles/${slug}`} className="text-blue-500">{title}</Link>
      </h2>
      <p className="my-2 text-sm font-light line-clamp-3">
        {content}
      </p>
      <div className="flex flex-wrap mr-[-2%] md:mr-[-1%]">
        {thumbnailUrls.map((url) => (
          <img key={url} src={url} className="w-[18%] md:w-[9%] mr-[2%] mb-[2%] md:mr-[1%] md:mb-[1%]" />
        ))}
      </div>
    </div>
  )
}
