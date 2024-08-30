import { promises as fs } from 'fs'
import path from 'path'
import { parse, format } from 'date-fns'
import matter from 'gray-matter'
import { getCameraName } from '@/core/cameras'

export class Article {
  readonly slug: string
  readonly title: string | null
  readonly status: string | null
  readonly location: string
  readonly content: string

  constructor(slug: string, title: string | null, status: string | null, location: string, content: string) {
    this.slug = slug
    this.title = title
    this.status = status
    this.location = location
    this.content = content
  }

  get month() {
    return this.slug.slice(0, 6)
  }

  formatTitle() {
    const date = format(parse(this.slug, 'yyyyMMdd', new Date()), 'yyyy年M月d日')
    return this.title ? `${date}: ${this.title}` : date
  }

  imageUrls() {
    const urls: string[] = []
    const regex = /(https:\/\/photos\.apkas\.net\/medium\/.*?\.webp)/g
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

  async exifs() {
    const urls = this.imageUrls()
    const exifUrls = urls.map(url => url.replace('medium', 'exif').replace('.webp', '.json'))
    const exifs = (await Promise.all(
      exifUrls.map(url => fetch(url).then(res => res.json()))
    )).map(exif => ({
      model: getCameraName(exif.Model),
      lens: getCameraName(exif.LensModel),
      focalLength: exif.FocalLength || null,
      focalLength35: exif.FocalLengthIn35mmFilm || null,
      fNumber: exif.FNumber || null,
      shutterSpeed: exif.ExposureTime || null,
      iso: exif.ISOSpeedRatings || null
    }))
    return new Map(urls.map((url, i) => [url, exifs[i]]))
  }

  async uniqueCameras() {
    const exifs = Array.from((await this.exifs()).values())
    const cameras = exifs.map(exif => exif.model)
      .filter(name => name !== null)
    const lenses = exifs.map(exif => exif.lens)
      .filter(name => name !== null)
    return Array.from(new Set(cameras))
      .concat(Array.from(new Set(lenses)))
  }

  async cameraCaptions() {
    const exifs = await this.exifs()
    return new Map(Array.from(exifs).map(([url, exif]) => {
      const model = exif.model || ''
      const captions1 = [`${model}`]
      if (model.indexOf('iPhone') && exif.lens) {
        captions1.push(`${exif.lens}`)
      }
      const captions2 = []
      if (model.indexOf('iPhone') && exif.focalLength) {
        if (exif.focalLength35 && exif.focalLength !== exif.focalLength35) {
          captions2.push(`${exif.focalLength} (${exif.focalLength35}) mm`)
        } else {
          captions2.push(`${exif.focalLength}mm`)
        }
      } else if (!model.indexOf('iPhone') && exif.focalLength35) {
        captions2.push(`${exif.focalLength35}mm`)
      }
      if (model.indexOf('iPhone')) {
        if (exif.fNumber) {
          captions2.push(`F${exif.fNumber}`)
        }
        if (exif.shutterSpeed) {
          const ss = Number(exif.shutterSpeed)
          if (ss >= 1) {
            captions2.push(`${ss}s`)
          } else {
            captions2.push(`1/${1 / ss}s`)
          }
        }
        if (exif.iso) {
          captions2.push(`ISO${exif.iso}`)
        }
      }
      const caption = captions1.join(', ') + (captions2.length > 0 ? `<br>- ${captions2.join(', ')}` : '')
      return [url, caption]
    }))
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
        if (process.env.NODE_ENV === 'production' && data.status === 'draft') {
          continue
        }
        const location = data.location || 'Tokyo, Japan'
        articles.push(new Article(
          p.replace('.md', ''),
          data.title || null,
          data.status || null,
          location,
          content
        ))
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

export const getArticlesByMonth = async (month: string) => {
  const articles = await getArticles()
  const articlesByMonth = articles
    .map((article, index) => ({ article, index }))
    .filter(({ article }) => article.month === month)
  const minIndex = articlesByMonth.length > 0 ? articlesByMonth[0].index : 0
  const maxIndex = articlesByMonth.length > 0 ? articlesByMonth[articlesByMonth.length - 1].index : 0
  const nextMonth = articles[minIndex - 1] ? articles[minIndex - 1].month : null
  const prevMonth = articles[maxIndex + 1] ? articles[maxIndex + 1].month : null
  return {
    articles: articlesByMonth.map(({ article }) => article),
    nextMonth,
    prevMonth
  }
}

export const getArticlesByCamera = async (camera: string) => {
  const articles = await getArticles()
  const filter = await Promise.all(
    articles.map(article => article.uniqueCameras().then(cameras => cameras.includes(camera)))
  )
  return articles.filter((_, i) => filter[i])
}

export const getArticlesByLocation = async (location: string) => {
  const articles = await getArticles()
  return articles.filter(article => article.location === location)
}
