import Link from 'next/link'
import { parse, format } from 'date-fns'
import { type Article, getArticles } from '@/core/articles'

function ArticleCard({ article }: Readonly<{ article: Article }>) {
  const { slug, content } = article
  const title = format(parse(slug, 'yyyyMMdd', new Date()), 'yyyy年M月d日')
  return (
    <div key={slug} className="my-8">
      <h2 className="my-2 text-lg font-bold">
        <Link href={`/articles/${slug}`} >{title}</Link>
      </h2>
      <p className="my-2 text-sm font-light line-clamp-3">
        {content}
      </p>
    </div>
  )
}

export default async function Page() {
  const articles = await getArticles()
  return (
    <main className="p-4">
      <h1 className="my-2 text-2xl font-bold">diary</h1>
      <p className="text-base font-normal">apkasの日記</p>

      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </main>
  )
}
