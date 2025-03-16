export const cameraMaster = [
  // 所持中
  // E body
  { type: 'own', slug: 'ILCE-7RM5', name: 'α7R V' },
  { type: 'own', slug: 'ILCE-7CM2', name: 'α7C II' },
  // compact
  { type: 'own', slug: 'iPhone 15 Pro', name: 'iPhone 15 Pro' },
  { type: 'own', slug: 'LEICA D-Lux 8', name: 'D-LUX 8' },
  { type: 'own', slug: 'RICOH GR III', name: 'GR III' },
  { type: 'own', slug: 'RICOH GR IIIx', name: 'GR IIIx' },
  // E lens
  { type: 'own', slug: 'FE 24-70mm F2.8 GM II', name: 'FE 24-70mm F2.8 GM II' },
  { type: 'own', slug: 'E 28-200mm F2.8-5.6 A071', name: '28-200mm F/2.8-5.6 Di III RXD' },

  // 手放したカメラ・レンズ
  // E body
  { type: 'release', slug: 'ILCE-7M3', name: 'α7 III' },
  { type: 'release', slug: 'ILCE-7S', name: 'α7S' },
  // F body
  { type: 'release', slug: 'NIKON D5600', name: 'D5600' },
  // MFT body
  { type: 'release', slug: 'DC-GF9', name: 'LUMIX GF9' },
  { type: 'release', slug: 'E-P7', name: 'PEN E-P7' },
  // compact
  { type: 'release', slug: 'iPhone 12', name: 'iPhone 12' },
  { type: 'release', slug: 'foodie', name: 'iPhone 12' },
  // E lens
  { type: 'release', slug: 'FE 16-35mm F4 ZA OSS', name: 'Vario-Tessar T* FE 16-35mm F4 ZA OSS' },
  { type: 'release', slug: 'FE 20-70mm F4 G', name: 'FE 20-70mm F4 G' },
  { type: 'release', slug: 'FE 24-105mm F4 G OSS', name: 'FE 24-105mm F4 G OSS' },
  { type: 'release', slug: 'FE 70-200mm F2.8 GM OSS II', name: 'FE 70-200mm F2.8 GM OSS II' },
  { type: 'release', slug: 'FE 70-300mm F4.5-5.6 G OSS', name: 'FE 70-300mm F4.5-5.6 G OSS' },
  { type: 'release', slug: 'FE 24mm F2.8 G', name: 'FE 24mm F2.8 G' },
  { type: 'release', slug: 'FE 40mm F2.5 G', name: 'FE 40mm F2.5 G' },
  { type: 'release', slug: 'FE 55mm F1.8 ZA', name: 'Sonnar T* FE 55mm F1.8 ZA' },
  { type: 'release', slug: 'FE 90mm F2.8 Macro G OSS', name: 'FE 90mm F2.8 Macro G OSS' },
  { type: 'release', slug: 'E 20-40mm F2.8 A062', name: '20-40mm F/2.8 Di III VXD' },
  // F lens
  { type: 'release', slug: '18.0-55.0 mm f/3.5-5.6', name: 'AF-P DX NIKKOR 18-55mm f/3.5-5.6G VR' },
  { type: 'release', slug: '70.0-300.0 mm f/4.5-6.3', name: 'AF-P DX NIKKOR 70-300mm f/4.5-6.3G ED VR' },
  { type: 'release', slug: '35.0 mm f/1.8', name: 'AF-S DX NIKKOR 35mm f/1.8G' },
  // MFT lens
  { type: 'release', slug: 'LUMIX G VARIO 12-32/F3.5-5.6', name: 'LUMIX G VARIO 12-32mm/F3.5-5.6 ASPH./MEGA O.I.S.' },
  { type: 'release', slug: 'LUMIX G 25/F1.7', name: 'LUMIX G 25mm/F1.7 ASPH.' },
  { type: 'release', slug: 'OLYMPUS M.14-42mm F3.5-5.6 EZ', name: 'M.ZUIKO DIGITAL ED 14-42mm F3.5-5.6 EZ' },
  { type: 'release', slug: 'OLYMPUS M.40-150mm F4.0-5.6 R', name: 'M.ZUIKO DIGITAL ED 40-150mm F4.0-5.6 R' },
  { type: 'release', slug: 'OLYMPUS M.17mm F2.8', name: 'M.ZUIKO DIGITAL 17mm F2.8' },

  // オールドレンズ他
  // M42
  { type: 'old', slug: 'Super-Takumar 28mm F3.5', name: 'Super-Takumar 28mm F3.5' },
  { type: 'old', slug: 'Super-Takumar 55mm F1.8', name: 'Super-Takumar 55mm F1.8' },
  // L39
  { type: 'old', slug: 'Utulens 32mm F16', name: 'Utulens' },
  // CY
  { type: 'old', slug: 'CONTAX Planar T* 50mm F1.4 AE', name: 'CONTAX Planar T* 50mm F1.4 AE' },
  // SR
  { type: 'old', slug: 'Auto ROKKOR-PF 58mm F1.4', name: 'AUTO ROKKOR-PF 58mm F1.4' },
  { type: 'old', slug: 'MC Tele ROKKOR-PF 135mm F2.8', name: 'MC TELE ROKKOR-PF 135mm F2.8' }
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
