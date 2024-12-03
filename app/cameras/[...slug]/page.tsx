import React from 'react'
import Link from 'next/link'
import { FaChevronLeft } from 'react-icons/fa6'
import { aggArticlesByCamera } from '@/core/aggregate'
import { getArticlesByCamera } from '@/core/articles'
import ArticleCard from '@/components/card'

export async function generateStaticParams() {
  const agg = await aggArticlesByCamera()
  return agg.own.map(({ camera }) => ({ slug: camera.split('/') }))
    .concat(agg.release.map(({ camera }) => ({ slug: camera.split('/') })))
    .concat(agg.old.map(({ camera }) => ({ slug: camera.split('/') })))
}

export default async function Page({ params }: Readonly<{ params: { slug: string[] } }>) {
  const { slug } = params
  const camera = slug.map(s => decodeURIComponent(s)).join('/')
  const articles = await getArticlesByCamera(camera)
  const count = articles.length

  return (
    <main className="max-w-screen-md mx-auto p-4">
      <div className="my-4">
        <p className="text-base font-normal">
          <FaChevronLeft className="inline-block pb-1" />
          <Link href="/" className="text-blue-500">HOME</Link>
        </p>
        <h1 className="text-2xl font-bold">撮影機材: {camera} の日記一覧 ({count}件)</h1>
      </div>

      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </main>
  )
}
