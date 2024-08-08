import Link from 'next/link'
import { getArticles } from '@/core/articles'

export default async function Page() {
  const articles = await getArticles()
  return (
    <main className="p-4">
      <h1 className="my-2 text-2xl font-bold">diary</h1>
      <p className="text-base font-normal">apkasの日記</p>

      <div className="my-8">
        {articles.map((article) => (
          <h2 key={article.slug} className="my-2 text-lg font-bold">
            <Link href={`/articles/${article.slug}`}>{article.slug}</Link>
          </h2>
        ))}
      </div>
    </main>
  )
}
