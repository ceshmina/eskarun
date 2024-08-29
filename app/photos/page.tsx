import React from 'react'
import Link from 'next/link'
import { FaChevronLeft } from 'react-icons/fa6'
import { getArticles } from '@/core/articles'

export default async function Page() {
  const articles = await getArticles()
  const photos: { url: string, date: string | null }[] = articles.map(article =>
    article.thumbnailUrls()
      .map((url, index) => (!index ? { url, date: article.slug } : { url, date: null }))
      .reverse()
  ).flat()

  return (
    <main className="max-w-screen-md mx-auto p-4">
      <div className="my-4">
        <p className="text-base font-normal">
          <FaChevronLeft className="inline-block pb-1" />
          <Link href="/" className="text-blue-500">日記一覧</Link>
        </p>
        <h1 className="text-2xl font-bold">すべての写真</h1>
      </div>

      <div className="my-8 flex flex-wrap mr-[-2%] md:mr-[-1%]">
        {photos.map(({ url, date }) => (
          <div key={url} className="w-[18%] md:w-[9%] mr-[2%] mb-[2%] md:mr-[1%] md:mb-[1%]">
            <p className="text-xs my-[1px] text-gray-500">{date || '　'}</p>
            <img src={url}/>
          </div>
        ))}
      </div>
    </main>
  )
}
