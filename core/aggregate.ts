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
  const aggCameras = new Map<string, number>()
  const aggLenses = new Map<string, number>()
  const cameraLastAppearance = new Map<string, string>() // カメラ名 -> 最新のslug
  const lensLastAppearance = new Map<string, string>() // レンズ名 -> 最新のslug
  
  await Promise.all(
    articles.map(async (article) => {
      const { cameras, lenses } = await article.uniqueCamerasAndLenses()
      
      cameras.forEach(camera => {
        aggCameras.set(camera, (aggCameras.get(camera) || 0) + 1)
        if (!cameraLastAppearance.has(camera)) {
          cameraLastAppearance.set(camera, article.slug)
        }
      })
      
      lenses.forEach(lens => {
        aggLenses.set(lens, (aggLenses.get(lens) || 0) + 1)
        if (!lensLastAppearance.has(lens)) {
          lensLastAppearance.set(lens, article.slug)
        }
      })
    })
  )
  
  // カメラを最新出現順でソート
  const cameras = Array.from(aggCameras.entries())
    .map(([camera, count]) => ({ 
      camera, 
      count, 
      lastSlug: cameraLastAppearance.get(camera) || '' 
    }))
    .sort((a, b) => b.lastSlug.localeCompare(a.lastSlug))
    .map(({ camera, count }) => ({ camera, count }))
  
  // レンズを最新出現順でソート
  const lenses = Array.from(aggLenses.entries())
    .map(([camera, count]) => ({ 
      camera, 
      count, 
      lastSlug: lensLastAppearance.get(camera) || '' 
    }))
    .sort((a, b) => b.lastSlug.localeCompare(a.lastSlug))
    .map(({ camera, count }) => ({ camera, count }))
  
  return {
    cameras,
    lenses
  }
}

export const aggArticlesByLocation = async () => {
  const articles = await getArticles()
  const aggJapan = new Map<string, number>()
  const aggOther = new Map<string, number>()
  const japanLastAppearance = new Map<string, string>() // 場所名 -> 最新のslug
  const otherLastAppearance = new Map<string, string>() // 場所名 -> 最新のslug
  
  articles.forEach(article => {
    const location = article.location
    if (location.includes('Japan')) {
      aggJapan.set(location, (aggJapan.get(location) || 0) + 1)
      if (!japanLastAppearance.has(location)) {
        japanLastAppearance.set(location, article.slug)
      }
    } else {
      aggOther.set(location, (aggOther.get(location) || 0) + 1)
      if (!otherLastAppearance.has(location)) {
        otherLastAppearance.set(location, article.slug)
      }
    }
  })
  
  return {
    japan: Array.from(aggJapan.entries())
      .map(([location, count]) => ({
        location,
        count,
        lastSlug: japanLastAppearance.get(location) || ''
      }))
      .sort((a, b) => b.lastSlug.localeCompare(a.lastSlug))
      .map(({ location, count }) => ({ location, count })),
    other: Array.from(aggOther.entries())
      .map(([location, count]) => ({
        location,
        count,
        lastSlug: otherLastAppearance.get(location) || ''
      }))
      .sort((a, b) => b.lastSlug.localeCompare(a.lastSlug))
      .map(({ location, count }) => ({ location, count }))
  }
}
