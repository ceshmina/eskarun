import Link from 'next/link'
import { Article } from '@/core/articles'

export default function ArticleCard({ article }: Readonly<{ article: Article }>) {
  const { slug, content } = article
  const title = article.formatTitle()
  const thumbnailUrls = article.thumbnailUrls()

  const plainText = content.replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/<[^>]*>.*?<\/[^>]*>/g, '')  // htmlタグを中身ごと削除
    .replace(/<[^>]*>/g, '')  // 残ったタグを削除
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/[*_~`]{1,2}/g, '')
    .replace('---', '')

  return (
    <div key={slug} className="my-8">
      <h2 className="my-2 text-lg font-bold">
        <Link href={`/articles/${slug}`} className="text-blue-500">{title}</Link>
      </h2>
      <p className="my-2 text-sm font-light line-clamp-3">
        {plainText}
      </p>
      <div className="flex flex-wrap mr-[-2%] md:mr-[-1%]">
        {thumbnailUrls.map((url) => (
          <img key={url} src={url} className="w-[18%] md:w-[9%] mr-[2%] mb-[2%] md:mr-[1%] md:mb-[1%] aspect-square object-cover" />
        ))}
      </div>
    </div>
  )
}
