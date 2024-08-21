const cameraMaster = [
  { slug: 'iPhone 15 Pro', name: 'iPhone 15 Pro' },
  { slug: 'ILCE-7M3', name: 'α7 III' },
  { slug: 'ILCE-7S', name: 'α7S' },
  { slug: 'FE 20-70mm F4 G', name: 'FE 20-70mm F4 G' },
  { slug: 'FE 55mm F1.8 ZA', name: 'Sonnar T* FE 55mm F1.8 ZA' },
  { slug: 'FE 90mm F2.8 Macro G OSS', name: 'FE 90mm F2.8 Macro G OSS' },
  { slug: 'E-P7', name: 'PEN E-P7' },
  { slug: 'OLYMPUS M.14-42mm F3.5-5.6 EZ', name: 'M.ZUIKO DIGITAL ED 14-42mm F3.5-5.6 EZ' },
  { slug: 'OLYMPUS M.40-150mm F4.0-5.6 R', name: 'M.ZUIKO DIGITAL ED 40-150mm F4-5.6 R' }
]

export const getCameraName = (slug: string) => {
  const camera = cameraMaster.find(camera => camera.slug === slug)
  return camera ? camera.name : null
}

export const getCameraSlug = (name: string) => {
  const camera = cameraMaster.find(camera => camera.name === name)
  return camera ? camera.slug : null
}
