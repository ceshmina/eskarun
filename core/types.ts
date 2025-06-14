export interface RawExifData {
  Model?: string
  LensModel?: string
  FocalLength?: number
  FocalLength35efl?: number
  FocalLengthIn35mmFormat?: number
  FocalLengthIn35mmFilm?: number
  FNumber?: number
  ExposureTime?: number
  StandardOutputSensitivity?: number
  ISOSpeedRatings?: number
  ISO?: number
  CreativeStyle?: number
  FilmMode?: number
  ImageTone?: number
  ExposureCompensation?: number
}

export interface ProcessedExifData {
  model: string | null
  lens: string | null
  focalLength: number | null
  focalLength35: number | null
  fNumber: number | null
  shutterSpeed: number | null
  iso: number | null
  creativeStyle: string | null
  filmMode: string | null
  imageTone: string | null
  exposureCompensation: number | null
}

export interface CameraInfo {
  cameras: string[]
  lenses: string[]
}

export interface AggregationItem {
  key: string
  count: number
}

export interface MonthlyAggregation {
  year: string
  months: Array<{
    month: string
    count: number
  }>
}

export interface CameraAggregation {
  cameras: Array<{
    camera: string
    count: number
  }>
  lenses: Array<{
    camera: string
    count: number
  }>
}

export interface LocationAggregation {
  japan: Array<{
    location: string
    count: number
  }>
  other: Array<{
    location: string
    count: number
  }>
}

export interface ArticleNavigation {
  article: import('./articles').Article
  next: import('./articles').Article | null
  prev: import('./articles').Article | null
}

export interface MonthlyArticles {
  articles: import('./articles').Article[]
  nextMonth: string | null
  prevMonth: string | null
}