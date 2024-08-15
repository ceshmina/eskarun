import Link from 'next/link'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Article, getArticles, getArticleWithNexts} from '@/core/articles'

export async function generateStaticParams() {
  const articles = await getArticles()
  return articles.map(article => ({ slug: article.slug }))
}

function ArticleLink({ article }: Readonly<{ article: Article }>) {
  return (
    <Link href={`/articles/${article.slug}`} className="text-blue-500">
      {article.formatTitle()}
    </Link>
  )
}

export default async function Page({ params }: Readonly<{ params: { slug: string } }>) {
  const { slug } = params
  const { article, next, prev } = await getArticleWithNexts(slug)
  if (!article) {
    return null
  }

  const title = article.formatTitle()
  return (
    <main className="max-w-screen-md mx-auto p-4">
      <div className="my-4">
        <p className="text-base font-normal">
          <FaChevronLeft className="inline-block pb-1" />
          <Link href="/" className="text-blue-500">日記一覧</Link>
        </p>
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
    
      <div key={article.slug} className="my-8">
        {<Markdown remarkPlugins={[remarkGfm]} components={{
          p: ({ children }) => <p className="text-base font-normal my-1">{children}</p>,
          img: ({ src }) => <img src={src} className="my-4" />,
          hr: () => <hr className="my-8 mx-auto w-72 h-1 bg-gray-300" />,
        }}>{article.content}</Markdown>}
      </div>

      <div className="my-8 flex justify-between">
        {next ? <div>
          <p>次の日記</p>
          <p>
            <FaChevronLeft className="inline-block pb-1" />
            <ArticleLink article={next} />
          </p>
        </div> : <div />}
        {prev ? <div className="text-right">
          <p>前の日記</p>
          <p>
            <ArticleLink article={prev} />
            <FaChevronRight className="inline-block pb-1" />
          </p>
        </div> : <div />}
      </div>
    </main>
  )
}
