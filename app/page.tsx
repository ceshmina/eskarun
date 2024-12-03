import { getArticles } from '@/core/articles'
import ArticleCard from '@/components/card'

export default async function Page() {
  const articles = (await getArticles()).slice(0, 5)
  return (
    <main className="max-w-screen-md mx-auto p-4">
      <div className="my-4">
        <h1 className="text-2xl font-bold">eskarun</h1>
        <p className="text-base font-normal">shu&apos;s diary</p>
      </div>

      <div className="my-16">
        <p className="my-2 text-lg font-bold">最新の日記</p>
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </main>
  )
}
