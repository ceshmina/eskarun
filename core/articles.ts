import { promises as fs } from 'fs'
import path from 'path'
import { parse, format } from 'date-fns'
import matter from 'gray-matter'
import { getCameraName } from '@/core/cameras'

export class Article {
  readonly slug: string
  readonly content: string

  constructor(slug: string, content: string) {
    this.slug = slug
    this.content = content
  }

  formatTitle() {
    return format(parse(this.slug, 'yyyyMMdd', new Date()), 'yyyy年M月d日')
  }

  imageUrls() {
    const urls: string[] = []
    const regex = /!\[.*?\]\((.*?)\)/g
    let match: RegExpExecArray | null
    while ((match = regex.exec(this.content)) !== null) {
      urls.push(match[1])
    }
    return urls
  }

  thumbnailUrls() {
    const urls = this.imageUrls()
    return urls.map(url => url.replace('medium', 'thumbnail'))
  }

  exifUrls() {
    const urls = this.imageUrls()
    return urls.map(url => url.replace('medium', 'exif').replace('.webp', '.json'))
  }

  async uniqueCameras() {
    const exifs = await Promise.all(
      this.exifUrls().map(url => fetch(url).then(res => res.json()))
    )
    const cameras = exifs.map(exif => exif.Model as string)
    const lenses = exifs.map(exif => exif.LensModel as string)
    const uniques = Array.from(new Set(cameras)).concat(Array.from(new Set(lenses)))
    const names = uniques.map(unique => getCameraName(unique))
      .filter(name => name !== null) as string[]
    return names
  }
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
        articles.push(new Article(p.replace('.md', ''), content))
      }
    }
  }
  await _search('_articles')
  return articles.sort((a, b) => b.slug.localeCompare(a.slug))
}

export const getArticleWithNexts = async (slug: string) => {
  const articles = await getArticles()
  const index = articles.findIndex(article => article.slug === slug)
  const next = articles[index - 1] || null
  const prev = articles[index + 1] || null
  return { article: articles[index], next, prev }
}

export const getArticlesByCamera = async (camera: string) => {
  const articles = await getArticles()
  const filter = await Promise.all(
    articles.map(article => article.uniqueCameras().then(cameras => cameras.includes(camera)))
  )
  return articles.filter((_, i) => filter[i])
}
