import React from 'react'
import Link from 'next/link'
import { FaChevronLeft } from 'react-icons/fa6'
import { getArticles, getArticlesByCamera } from '@/core/articles'
import ArticleCard from '@/components/card'

export async function generateStaticParams() {
  const articles = await getArticles()
  const uniqueCamerasList = (await Promise.all(
    articles.map(article => article.uniqueCameras())
  ))
  const uniqueCameras = Array.from(new Set(uniqueCamerasList.flat()))
  return uniqueCameras.map(camera => ({ slug: camera }))
}

export default async function Page({ params }: Readonly<{ params: { slug: string } }>) {
  const { slug } = params
  const camera = decodeURIComponent(slug)
  const articles = await getArticlesByCamera(camera)
  return (
    <main className="max-w-screen-md mx-auto p-4">
      <div className="my-4">
        <p className="text-base font-normal">
          <FaChevronLeft className="inline-block pb-1" />
          <Link href="/" className="text-blue-500">日記一覧</Link>
        </p>
        <h1 className="text-2xl font-bold">撮影機材: {camera} の日記一覧</h1>
      </div>

      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </main>
  )
}
