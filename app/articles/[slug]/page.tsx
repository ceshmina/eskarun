import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getArticles, getArticleBySlug } from '@/core/articles'

export async function generateStaticParams() {
  const articles = await getArticles()
  return articles.map(article => ({ slug: article.slug }))
}

export default async function Page({ params }: Readonly<{ params: { slug: string } }>) {
  const { slug } = params
  const article = await getArticleBySlug(slug)
  if (!article) {
    return null
  }

  return (
    <main className="p-4">
      <h1 className="my-2 text-2xl font-bold">{slug}</h1>
    
      <div key={article.slug} className="my-8">
        {<Markdown remarkPlugins={[remarkGfm]} components={{
          p: ({ children }) => <p className="font-base font-normal my-1">{children}</p>,
          img: ({ src }) => <img src={src} className="my-4" />,
          hr: () => <hr className="my-8 mx-auto w-72 h-1 bg-gray-300" />,
        }}>{article.content}</Markdown>}
      </div>
    </main>
  )
}
