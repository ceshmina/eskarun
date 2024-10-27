import React from 'react'
import Link from 'next/link'
import { FaChevronLeft } from 'react-icons/fa6'
import { aggArticlesByLocation } from '@/core/aggregate'
import { getArticlesByLocation } from '@/core/articles'
import ArticleCard from '@/components/card'

export async function generateStaticParams() {
  const { japan, other } = await aggArticlesByLocation()
  return japan.map(({ location }) => ({ slug: location }))
    .concat(other.map(({ location }) => ({ slug: location })))
}

export default async function Page({ params }: Readonly<{ params: { slug: string } }>) {
  const { slug } = params
  const location = decodeURIComponent(slug)
  const articles = await getArticlesByLocation(location)
  const count = articles.length
  return (
    <main className="max-w-screen-md mx-auto p-4">
      <div className="my-4">
        <p className="text-base font-normal">
          <FaChevronLeft className="inline-block pb-1" />
          <Link href="/" className="text-blue-500">日記一覧</Link>
        </p>
        <h1 className="text-2xl font-bold">場所: {location} の日記一覧 ({count}件)</h1>
      </div>

      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </main>
  )
}
