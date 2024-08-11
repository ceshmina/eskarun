import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Article, getArticles, getArticleWithNexts} from '@/core/articles'

export async function generateStaticParams() {
  const articles = await getArticles()
  return articles.map(article => ({ slug: article.slug }))
}

function ArticleLink({ article }: Readonly<{ article: Article }>) {
  return <a href={`/articles/${article.slug}`} className="text-blue-500">{article.formatTitle()}</a>
}

export default async function Page({ params }: Readonly<{ params: { slug: string } }>) {
  const { slug } = params
  const { article, next, prev } = await getArticleWithNexts(slug)
  if (!article) {
    return null
  }

  const title = article.formatTitle()
  return (
    <main className="p-4">
      <h1 className="my-2 text-2xl font-bold">{title}</h1>
    
      <div key={article.slug} className="my-8">
        {<Markdown remarkPlugins={[remarkGfm]} components={{
          p: ({ children }) => <p className="font-base font-normal my-1">{children}</p>,
          img: ({ src }) => <img src={src} className="my-4" />,
          hr: () => <hr className="my-8 mx-auto w-72 h-1 bg-gray-300" />,
        }}>{article.content}</Markdown>}
      </div>

      <div className="my-8 flex justify-between">
        {next ? <div>
          <p>次の日記</p>
          <p>&lt; <ArticleLink article={next} /></p>
        </div> : <div />}
        {prev ? <div className="text-right">
          <p>前の日記</p>
          <p><ArticleLink article={prev} /> &gt;</p>
        </div> : <div />}
      </div>
    </main>
  )
}
