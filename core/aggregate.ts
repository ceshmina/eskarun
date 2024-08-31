import { getArticles } from '@/core/articles'
import { cameraMaster } from '@/core/cameras'

export const aggArticlesByMonth = async () => {
  const articles = await getArticles()
  const agg = new Map<string, number>()
  articles.forEach(article => {
    const month = article.month
    agg.set(month, (agg.get(month) || 0) + 1)
  })
  return Array.from(agg.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([month, count]) => ({ month, count }))
}

export const aggArticlesByCamera = async () => {
  const articles = await getArticles()
  const agg = new Map<string, number>()
  await Promise.all(
    articles.map(async (article) => {
      const cameras = await article.uniqueCameras()
      cameras.forEach(camera => {
        agg.set(camera, (agg.get(camera) || 0) + 1)
      })
    })
  )
  const master = Array.from(new Set(cameraMaster.map(camera => camera.name)))
  return master.map(camera => ({ camera, count: agg.get(camera) || 0 }))
}

export const aggArticlesByLocation = async () => {
  const articles = await getArticles()
  const agg = new Map<string, number>()
  articles.forEach(article => {
    const location = article.location
    agg.set(location, (agg.get(location) || 0) + 1)
  })
  return Array.from(agg.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([location, count]) => ({ location, count }))
}
