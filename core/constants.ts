export const EXIF_CONSTANTS = {
  CREATIVE_STYLES: {
    0: 'ST',
    1: 'VV', 
    3: 'PT',
    15: 'FL',
    18: 'SH',
    19: 'FL2',
  } as const,
  
  FILM_MODES: {
    0: 'Provia',
    288: 'Astia',
    512: 'Velvia',
    1280: 'Pro Neg. Std',
    1536: 'Classic Chrome',
    2048: 'Classic Neg',
    2560: 'Nostalgic Neg',
    2816: 'Reala Ace'
  } as const,
  
  IMAGE_TONES: {
    257: 'Vivid',
    262: 'Positive Film',
    267: 'Negative Film'
  } as const
} as const

export const DATE_CONSTANTS = {
  THUMBNAIL_START_DATE: '20250101',
  FALLBACK_DATE: '20991231'
} as const