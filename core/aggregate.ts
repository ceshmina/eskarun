import { getArticles } from '@/core/articles'

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
  return Array.from(agg.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([camera, count]) => ({ camera, count }))
}
