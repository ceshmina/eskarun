import { promises as fs } from 'fs'
import path from 'path'
import { parse, format } from 'date-fns'
import matter from 'gray-matter'
import { getCameraName } from '@/core/cameras'
import { RawExifData, ProcessedExifData, CameraInfo } from '@/core/types'
import { EXIF_CONSTANTS, DATE_CONSTANTS } from '@/core/constants'

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

  get year() {
    return this.slug.slice(0, 4)
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

  smallUrls() {
    const urls = this.imageUrls()
    if (this.slug >= DATE_CONSTANTS.THUMBNAIL_START_DATE && this.slug !== DATE_CONSTANTS.FALLBACK_DATE) {
      return urls.map(url => url.replace('medium', 'thumbnail'))
    } else {
      return []  // urls.map(url => url.replace('medium', 'small'))
    }
  }

  thumbnailUrls() {
    const urls = this.imageUrls()
    return urls.map(url => url.replace('medium', 'thumbnail'))
  }

  async exifs(): Promise<Map<string, ProcessedExifData>> {
    const urls = this.imageUrls()
    const exifUrls = urls.map(url => url.replace('medium', 'exif').replace('.webp', '.json'))
    const exifs = (await Promise.all(
      exifUrls.map(url => fetch(url).then(res => res.json() as Promise<RawExifData>))
    )).map(exif => {
      return {
        model: getCameraName(exif.Model || ''),
        lens: getCameraName(exif.LensModel || ''),
        focalLength: exif.FocalLength || null,
        focalLength35: exif.FocalLength35efl || exif.FocalLengthIn35mmFormat || exif.FocalLengthIn35mmFilm || null,
        fNumber: exif.FNumber || null,
        shutterSpeed: exif.ExposureTime || null,
        iso: exif.StandardOutputSensitivity || exif.ISOSpeedRatings || exif.ISO || null,
        creativeStyle: exif.CreativeStyle !== undefined ? 
          EXIF_CONSTANTS.CREATIVE_STYLES[exif.CreativeStyle as keyof typeof EXIF_CONSTANTS.CREATIVE_STYLES] || null : null,
        filmMode: exif.FilmMode !== undefined ? 
          EXIF_CONSTANTS.FILM_MODES[exif.FilmMode as keyof typeof EXIF_CONSTANTS.FILM_MODES] || null : null,
        imageTone: exif.ImageTone !== undefined ? 
          EXIF_CONSTANTS.IMAGE_TONES[exif.ImageTone as keyof typeof EXIF_CONSTANTS.IMAGE_TONES] || null : null,
        exposureCompensation: exif.ExposureCompensation || null
      } as ProcessedExifData
    })
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

  async uniqueCamerasAndLenses(): Promise<CameraInfo> {
    const exifs = Array.from((await this.exifs()).values())
    const cameras = Array.from(new Set(exifs.map(exif => exif.model)
      .filter(name => name !== null))) as string[]
    const lenses = Array.from(new Set(exifs.map(exif => exif.lens)
      .filter(name => name !== null))) as string[]
    return { cameras, lenses }
  }

  async cameraCaptions(): Promise<Map<string, string>> {
    const exifs = await this.exifs()
    return new Map(Array.from(exifs).map(([url, exif]) => {
      const model = exif.model || ''
      const captions1 = [`${model}`]
      if (model.indexOf('iPhone') && exif.lens) {
        captions1.push(`${exif.lens}`)
      }
      const captions2 = []
      const captions3 = []
      if (model.indexOf('iPhone') && exif.focalLength) {
        if (exif.focalLength35 && exif.focalLength !== exif.focalLength35) {
          captions2.push(`${Math.round(exif.focalLength)} (${Math.round(exif.focalLength35)}) mm`)
        } else {
          captions2.push(`${Math.round(exif.focalLength)}mm`)
        }
      } else if (!model.indexOf('iPhone')) {
        if (exif.focalLength35) {
          captions2.push(`${Math.round(exif.focalLength35)}mm`)
        }
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
            captions2.push(`1/${Math.round(1 / ss)}s`)
          }
        }
        if (exif.iso) {
          captions2.push(`ISO${exif.iso}`)
        }
        if (exif.creativeStyle) {
          captions3.push(`${exif.creativeStyle}`)
        }
        if (exif.filmMode) {
          captions3.push(`${exif.filmMode}`)
        }
        if (exif.imageTone) {
          captions3.push(`${exif.imageTone}`)
        }
        if (exif.exposureCompensation !== null && exif.exposureCompensation !== 0) {
          const sign = exif.exposureCompensation > 0 ? '+' : '';
          const value = Number.isInteger(exif.exposureCompensation) ? 
            exif.exposureCompensation : 
            exif.exposureCompensation.toFixed(1);
          captions3.push(`${sign}${value}EV`)
        }
      }
      let caption = captions1.join(', ');
      if (captions2.length > 0) {
        caption += `<br>- ${captions2.join(', ')}`;
      }
      if (captions3.length > 0) {
        if (captions2.length > 0) {
          caption += ` / ${captions3.join(', ')}`;
        } else {
          caption += `<br>- ${captions3.join(', ')}`;
        }
      }
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

export const getArticlesOfSameDate = async (slug: string) => {
  const articles = await getArticles()
  return articles.filter(article => 
    article.slug.slice(0, 4) !== slug.slice(0, 4) && article.slug.slice(4, 8) === slug.slice(4, 8))
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
