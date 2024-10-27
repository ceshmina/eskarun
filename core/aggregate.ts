import { getArticles } from '@/core/articles'
import { cameraMaster } from '@/core/cameras'

export const aggArticlesByMonth = async () => {
  const articles = await getArticles()
  const agg = new Map<string, Map<string, number>>()
  articles.forEach(article => {
    const year = article.year
    const month = article.month
    if (!agg.has(year)) {
      agg.set(year, new Map<string, number>())
    }
    const map = agg.get(year)!
    map.set(month, (map.get(month) || 0) + 1)
  })
  return Array.from(agg.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, map]) => ({
      year,
      months: Array.from(map.entries())
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([month, count]) => ({ month, count }))
    }))
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
  const own = Array.from(new Set(cameraMaster
    .filter(camera => camera.type == 'own')
    .map(camera => camera.name)))
  const release = Array.from(new Set(cameraMaster
    .filter(camera => camera.type == 'release')
    .map(camera => camera.name)))
  const old = Array.from(new Set(cameraMaster
    .filter(camera => camera.type == 'old')
    .map(camera => camera.name)))
  return {
    own: own.map(camera => ({ camera, count: agg.get(camera) || 0 })),
    release: release.map(camera => ({ camera, count: agg.get(camera) || 0 })),
    old: old.map(camera => ({ camera, count: agg.get(camera) || 0 }))
  }
}

export const aggArticlesByLocation = async () => {
  const articles = await getArticles()
  const aggJapan = new Map<string, number>()
  const aggOther = new Map<string, number>()
  articles.forEach(article => {
    const location = article.location
    if (location.includes('Japan')) {
      aggJapan.set(location, (aggJapan.get(location) || 0) + 1)
    } else {
      aggOther.set(location, (aggOther.get(location) || 0) + 1)
    }
  })
  return {
    japan: Array.from(aggJapan.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([location, count]) => ({ location, count })),
    other: Array.from(aggOther.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([location, count]) => ({ location, count }))
  }
}
