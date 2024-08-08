import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'

type Article = {
  slug: string
  content: string
}

export const getArticles = async () => {
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

export const getArticleBySlug = async (slug: string) => {
  const articles = await getArticles()
  return articles.find(article => article.slug === slug) || null
}
