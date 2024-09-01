import type { Metadata } from 'next'
import { mainFont } from '@/core/config'
import Burger from '@/components/burger'
import Navigation from '@/components/navigation'
import './globals.css'
import './burger.css'
import 'react-medium-image-zoom/dist/styles.css'

export const metadata: Metadata = {
  title: 'eskarun',
  description: "shu's diary"
}

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className={mainFont.className}>
        <Burger>
          <Navigation />
        </Burger>
        {children}
      </body>
    </html>
  )
}
