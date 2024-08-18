import React from 'react'
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
  const articles = await getArticlesByCamera(slug)
  return (
    <main className="max-w-screen-md mx-auto p-4">
      <div className="my-4">
        <h1 className="text-2xl font-bold">eskarun</h1>
        <p className="text-base font-normal">shu&apos;s diary</p>
      </div>

      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </main>
  )
}
