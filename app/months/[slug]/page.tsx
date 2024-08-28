import React from 'react'
import Link from 'next/link'
import { FaChevronLeft } from 'react-icons/fa6'
import { parse, format } from 'date-fns'
import { aggArticlesByMonth } from '@/core/aggregate'
import { getArticlesByMonth } from '@/core/articles'
import ArticleCard from '@/components/card'

export async function generateStaticParams() {
  const agg = await aggArticlesByMonth()
  return agg.map(({ month }) => ({ slug: month }))
}

export default async function Page({ params }: Readonly<{ params: { slug: string } }>) {
  const { slug } = params
  const articles = await getArticlesByMonth(slug)
  const formatMonth = format(parse(slug, 'yyyyMM', new Date()), 'yyyy年M月')
  const count = articles.length
  return (
    <main className="max-w-screen-md mx-auto p-4">
      <div className="my-4">
        <p className="text-base font-normal">
          <FaChevronLeft className="inline-block pb-1" />
          <Link href="/" className="text-blue-500">日記一覧</Link>
        </p>
        <h1 className="text-2xl font-bold">{formatMonth} の日記一覧 ({count}件)</h1>
      </div>

      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </main>
  )
}
