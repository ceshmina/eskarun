export const cameraMaster = [
  { slug: 'ILCE-7RM5', name: 'α7R V' },
  { slug: 'ILCE-7M3', name: 'α7 III' },
  { slug: 'ILCE-7S', name: 'α7S' },
  { slug: 'DC-GF9', name: 'LUMIX GF9' },
  { slug: 'E-P7', name: 'PEN E-P7' },
  { slug: 'iPhone 15 Pro', name: 'iPhone 15 Pro' },
  { slug: 'iPhone 12', name: 'iPhone 12' },
  { slug: 'foodie', name: 'iPhone 12' },
  { slug: 'NIKON D5600', name: 'D5600' },
  { slug: 'FE 16-35mm F4 ZA OSS', name: 'Vario-Tessar T* FE 16-35mm F4 ZA OSS' },
  { slug: 'FE 20-70mm F4 G', name: 'FE 20-70mm F4 G' },
  { slug: 'FE 24-70mm F2.8 GM II', name: 'FE 24-70mm F2.8 GM II' },
  { slug: 'FE 24-105mm F4 G OSS', name: 'FE 24-105mm F4 G OSS' },
  { slug: 'FE 70-200mm F2.8 GM OSS II', name: 'FE 70-200mm F2.8 GM OSS II' },
  { slug: 'FE 70-300mm F4.5-5.6 G OSS', name: 'FE 70-300mm F4.5-5.6 G OSS' },
  { slug: 'FE 24mm F2.8 G', name: 'FE 24mm F2.8 G' },
  { slug: 'FE 40mm F2.5 G', name: 'FE 40mm F2.5 G' },
  { slug: 'FE 55mm F1.8 ZA', name: 'Sonnar T* FE 55mm F1.8 ZA' },
  { slug: 'FE 90mm F2.8 Macro G OSS', name: 'FE 90mm F2.8 Macro G OSS' },
  { slug: 'LUMIX G VARIO 12-32/F3.5-5.6', name: 'LUMIX G VARIO 12-32mm/F3.5-5.6 ASPH./MEGA O.I.S.' },
  { slug: 'LUMIX G 25/F1.7', name: 'LUMIX G 25mm/F1.7 ASPH.' },
  { slug: 'OLYMPUS M.14-42mm F3.5-5.6 EZ', name: 'M.ZUIKO DIGITAL ED 14-42mm F3.5-5.6 EZ' },
  { slug: 'OLYMPUS M.40-150mm F4.0-5.6 R', name: 'M.ZUIKO DIGITAL ED 40-150mm F4.0-5.6 R' },
  { slug: 'OLYMPUS M.17mm F2.8', name: 'M.ZUIKO DIGITAL 17mm F2.8' },
  { slug: 'Super-Takumar 28mm F3.5', name: 'Super-Takumar 28mm F3.5' },
  { slug: '18.0-55.0 mm f/3.5-5.6', name: 'AF-P DX NIKKOR 18-55mm f/3.5-5.6G VR' },
  { slug: '70.0-300.0 mm f/4.5-6.3', name: 'AF-P DX NIKKOR 70-300mm f/4.5-6.3G ED VR' },
  { slug: '35.0 mm f/1.8', name: 'AF-S DX NIKKOR 35mm f/1.8G' },
  { slug: 'CONTAX Planar T* 50mm F1.4 AE', name: 'CONTAX Planar T* 50mm F1.4 AE' },
  { slug: 'MC Tele ROKKOR-PF 135mm F2.8', name: 'MC TELE ROKKOR-PF 135mm F2.8' },
  { slug: 'Utulens 32mm F16', name: 'Utulens 32mm F16' }
]

export const getCameraName = (slug: string) => {
  const camera = cameraMaster.find(camera => camera.slug === slug)
  return camera ? camera.name : null
}

export const getCameraCaption = async (src: string) => {
  const exifUrl = src.replace('medium', 'exif').replace('.webp', '.json')
  const exif = await fetch(exifUrl, { mode: 'no-cors' }).then(res => res.json())
  const model = getCameraName(exif.Model)
  const lens = getCameraName(exif.LensModel)
  return `${model}${lens ? ` + ${lens}` : ''}`
}
