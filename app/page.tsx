import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Markdown from 'react-markdown'

type Article = {
  slug: string
  content: string
}

const getArticles = async () => {
  const articles: Article[] = []
  const _search = async (dir: string) => {
    const paths = await fs.readdir(dir)
    for (const p of paths) {
      const fullPath = path.join(dir, p)
      const stat = await fs.stat(fullPath)
      if (stat.isDirectory()) {
        await _search(fullPath)
      } else if (p.endsWith('.md')) {
        const markdownBody = (await fs.readFile(fullPath)).toString()
        const { content, data } = matter(markdownBody)
        if (data.status === 'draft') continue
        articles.push({
          slug: p.replace('.md', ''),
          content
        })
      }
    }
  }
  await _search('_articles')
  return articles.sort((a, b) => b.slug.localeCompare(a.slug))
}


export default async function Page() {
  const articles = await getArticles()
  return (
    <main className="p-4">
      <h1 className="my-2 text-2xl font-bold">diary</h1>
      <p className="text-base font-normal">apkasの日記</p>

      <div className="my-8">
        {articles.map((article) => (
          <div key={article.slug} className="my-8">
            <h2 className="my-2 text-lg font-bold">{article.slug}</h2>
            <div>
              {<Markdown components={{
                p: ({ children }) => <p className="font-base font-normal my-1">{children}</p>,
                img: ({ src }) => <img src={src} className="my-4" />,
                hr: () => <hr className="my-8 mx-auto w-72 h-1 bg-gray-300" />,
              }}>{article.content}</Markdown>}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
