import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import './globals.css'

const mainFont = Noto_Sans_JP({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'eskarun',
  description: "shu's diary"
}

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className={mainFont.className}>{children}</body>
    </html>
  )
}
