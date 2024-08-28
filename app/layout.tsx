import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import Link from 'next/link'
import { parse, format } from 'date-fns'
import { aggArticlesByMonth } from '@/core/aggregate'
import './globals.css'

const mainFont = Noto_Sans_JP({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'eskarun',
  description: "shu's diary"
}

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const articlesByMonth = await aggArticlesByMonth()
  return (
    <html lang="ja">
      <body className={mainFont.className}>
        {children}

        <footer className="max-w-screen-md mx-auto p-4">
          <div>
            <h2 className="text-lg font-bold">月別</h2>
            <ul className="my-4">
              {articlesByMonth.map(({ month, count }) => {
                const formatMonth = format(parse(month, 'yyyyMM', new Date()), 'yyyy年M月')
                return (<li key={month} className="my-1 text-base font-normal">
                  <Link href={`/months/${month}`} className="text-blue-500">{formatMonth} ({count})</Link>
                </li>)
              })}
            </ul>
          </div>
        </footer>
      </body>
    </html>
  )
}
