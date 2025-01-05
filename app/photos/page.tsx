import React from 'react'
import Link from 'next/link'
import { FaChevronLeft } from 'react-icons/fa6'
import { getArticles } from '@/core/articles'
import Thumbnail from '@/components/thumbnail'

export default async function Page() {
  const articles = await getArticles()
  const photos = articles.map(article =>
    article.smallUrls().reverse().map((url, index) => ({
      url,
      date: article.slug,
      showDate: index === 0,
      title: article.formatTitle()
    }))
  ).flat()

  return (
    <main className="max-w-screen-md mx-auto p-4">
      <div className="my-4">
        <p className="text-base font-normal">
          <FaChevronLeft className="inline-block pb-1" />
          <Link href="/" className="text-blue-500">HOME</Link>
        </p>
        <h1 className="text-2xl font-bold">すべての写真</h1>
        <p className="my-2 text-base font-normal">2025年〜</p>
      </div>

      <div className="my-8 flex flex-wrap mr-[-2%] md:mr-[-1%]">
        {photos.map(({ url, date, showDate, title }) => (
          <div key={url} className="w-[18%] md:w-[9%] mr-[2%] mb-[2%] md:mr-[1%] md:mb-[1%]">
            <p className="text-xs my-[1px] text-gray-500">{showDate ? date : '　'}</p>
            <Thumbnail src={url} date={date} title={title} />
          </div>
        ))}
      </div>
    </main>
  )
}
