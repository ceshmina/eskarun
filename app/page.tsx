import Link from 'next/link'
import { Article, getArticles } from '@/core/articles'

function ArticleCard({ article }: Readonly<{ article: Article }>) {
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
      <div className="flex flex-wrap">
        {thumbnailUrls.map((url) => (
          <img key={url} src={url} className="w-16 mr-2 mb-2" />
        ))}
      </div>
    </div>
  )
}

export default async function Page() {
  const articles = await getArticles()
  return (
    <main className="p-4">
      <div className="my-4">
        <h1 className="text-2xl font-bold">eskarun</h1>
        <p className="text-base font-normal">shu&apos;s diary</p>
      </div>

      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </main>
  )
}
