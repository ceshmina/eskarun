import Link from 'next/link'
import { FaCamera } from 'react-icons/fa'
import { FaChevronLeft, FaChevronRight, FaLocationDot } from 'react-icons/fa6'
import Markdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { Article, getArticles, getArticleWithNexts} from '@/core/articles'
import React from 'react'
import 'katex/dist/katex.min.css'

export async function generateStaticParams() {
  const articles = await getArticles()
  return articles.map(article => ({ slug: article.slug }))
}

function ArticleLink({ article }: Readonly<{ article: Article }>) {
  return (
    <Link href={`/articles/${article.slug}`} className="text-blue-500">
      {article.formatTitle()}
    </Link>
  )
}

function CameraLink({ camera }: Readonly<{ camera: string }>) {
  return (
    <span className="mr-2 mt-2 px-1 inline-block text-blue-500 border-[1px] border-gray-300 rounded">
      <Link href={`/cameras/${camera}`}>{camera}</Link>
    </span>
  )
}

const hasOnlyImage = (children: React.ReactNode) => {
  if (React.Children.count(children) !== 1) {
    return false
  }
  const child = React.Children.toArray(children)[0]
  return React.isValidElement(child) && child.props.node.tagName === 'img'
}

export default async function Page({ params }: Readonly<{ params: { slug: string } }>) {
  const { slug } = params
  const { article, next, prev } = await getArticleWithNexts(slug)
  if (!article) {
    return null
  }

  const title = article.formatTitle()
  const uniqueCameras = await article.uniqueCameras()

  return (
    <main className="max-w-screen-md mx-auto p-4">
      <div className="my-4">
        <p className="text-base font-normal">
          <FaChevronLeft className="inline-block pb-1" />
          <Link href="/" className="text-blue-500">日記一覧</Link>
        </p>
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
    
      <div key={article.slug} className="my-8">
        {<Markdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            p: ({ children }) => (
              hasOnlyImage(children) ? children as React.ReactElement :
              <p className="text-base font-normal my-2">{children}</p>
            ),
            a: ({ children, href }) => (href ?
              <Link href={href} target="_blank" className="text-blue-500">{children}</Link> :
              <span>{children}</span>
            ),
            img: ({ src, alt }) => (<div className="my-8">
              <img src={src} className="my-2" />
              <p className="text-center text-sm italic text-gray-500">{alt}</p>
            </div>),
            ul: ({ children }) => <ul className="my-4">{children}</ul>,
            li: ({ children }) => <li className="list-disc my-1 ml-5">{children}</li>,
            hr: () => <hr className="my-12 mx-auto w-72 h-1 bg-gray-300" />,
            blockquote: ({ children }) => <blockquote className="my-8 ml-2 pl-4 border-l-4 border-gray-300">{children}</blockquote>,
          }}
        >{article.content}</Markdown>}
      </div>

      <p className="text-sm text-gray-500 mt-16 mb-2 leading-6">
        <FaLocationDot className="text-base inline-block mr-2 pb-[2px]" />
        {article.location}
      </p>

      {uniqueCameras.length > 0 && <p className="text-sm text-gray-500 mt-2 mb-8 leading-6">
        <FaCamera className="text-base inline-block mr-2 pb-1" />
        {uniqueCameras.map((camera, i) => (<CameraLink key={i} camera={camera} />))}
      </p>}
    
      <div className="my-8 flex justify-between">
        {next ? <div className="max-w-[48%]">
          <p>次の日記</p>
          <p>
            <FaChevronLeft className="inline-block pb-1" />
            <ArticleLink article={next} />
          </p>
        </div> : <div />}
        {prev ? <div className="max-w-[48%] text-right">
          <p>前の日記</p>
          <p>
            <ArticleLink article={prev} />
            <FaChevronRight className="inline-block pb-1" />
          </p>
        </div> : <div />}
      </div>
    </main>
  )
}
