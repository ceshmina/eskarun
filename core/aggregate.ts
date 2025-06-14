import { getArticles } from '@/core/articles'

type AggregationItem = {
  key: string
  count: number
}

const aggregateWithLastAppearance = <T>(
  items: T[],
  keyExtractor: (item: T) => string[],
  slugExtractor: (item: T) => string
): AggregationItem[] => {
  const countMap = new Map<string, number>()
  const lastAppearanceMap = new Map<string, string>()
  
  items.forEach(item => {
    const keys = keyExtractor(item)
    const slug = slugExtractor(item)
    
    keys.forEach(key => {
      countMap.set(key, (countMap.get(key) || 0) + 1)
      if (!lastAppearanceMap.has(key)) {
        lastAppearanceMap.set(key, slug)
      }
    })
  })
  
  return Array.from(countMap.entries())
    .map(([key, count]) => ({
      key,
      count,
      lastSlug: lastAppearanceMap.get(key) || ''
    }))
    .sort((a, b) => b.lastSlug.localeCompare(a.lastSlug))
    .map(({ key, count }) => ({ key, count }))
}

const aggregateWithLastAppearanceAsync = async <T>(
  items: T[],
  keyExtractor: (item: T) => Promise<string[]>,
  slugExtractor: (item: T) => string
): Promise<AggregationItem[]> => {
  const countMap = new Map<string, number>()
  const lastAppearanceMap = new Map<string, string>()
  
  await Promise.all(
    items.map(async item => {
      const keys = await keyExtractor(item)
      const slug = slugExtractor(item)
      
      keys.forEach(key => {
        countMap.set(key, (countMap.get(key) || 0) + 1)
        if (!lastAppearanceMap.has(key)) {
          lastAppearanceMap.set(key, slug)
        }
      })
    })
  )
  
  return Array.from(countMap.entries())
    .map(([key, count]) => ({
      key,
      count,
      lastSlug: lastAppearanceMap.get(key) || ''
    }))
    .sort((a, b) => b.lastSlug.localeCompare(a.lastSlug))
    .map(({ key, count }) => ({ key, count }))
}

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
  
  const cameras = await aggregateWithLastAppearanceAsync(
    articles,
    async (article) => {
      const { cameras } = await article.uniqueCamerasAndLenses()
      return cameras
    },
    (article) => article.slug
  )
  
  const lenses = await aggregateWithLastAppearanceAsync(
    articles,
    async (article) => {
      const { lenses } = await article.uniqueCamerasAndLenses()
      return lenses
    },
    (article) => article.slug
  )
  
  return {
    cameras: cameras.map(({ key, count }) => ({ camera: key, count })),
    lenses: lenses.map(({ key, count }) => ({ camera: key, count }))
  }
}

export const aggArticlesByLocation = async () => {
  const articles = await getArticles()
  
  const japanArticles = articles.filter(article => article.location.includes('Japan'))
  const otherArticles = articles.filter(article => !article.location.includes('Japan'))
  
  const japan = aggregateWithLastAppearance(
    japanArticles,
    (article) => [article.location],
    (article) => article.slug
  )
  
  const other = aggregateWithLastAppearance(
    otherArticles,
    (article) => [article.location],
    (article) => article.slug
  )
  
  return {
    japan: japan.map(({ key, count }) => ({ location: key, count })),
    other: other.map(({ key, count }) => ({ location: key, count }))
  }
}
