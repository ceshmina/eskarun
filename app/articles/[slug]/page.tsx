import React from 'react'
import Link from 'next/link'
import { FaCamera } from 'react-icons/fa'
import { FaChevronLeft, FaChevronRight, FaLocationDot } from 'react-icons/fa6'
import Markdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight'
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { Article, getArticles, getArticleWithNexts} from '@/core/articles'
import { codeFont } from '@/core/config'
import Image from '@/components/image'
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
  const cameraCaptions = await article.cameraCaptions()

  return (
    <main className="max-w-screen-md mx-auto px-0 md:px-4 py-4">
      <div className="my-4 mx-4 md:mx-0">
        <p className="text-base font-normal">
          <FaChevronLeft className="inline-block pb-1" />
          <Link href="/" className="text-blue-500">日記一覧</Link>
        </p>
        <h1 className="text-2xl font-bold">{title}</h1>
        {article.status === 'draft' && <p className="my-4 text-sm text-red-500">
          <span className="border-2 border-red-500 px-1 py-0.5 rounded">下書き</span>
        </p>}
      </div>
    
      <div key={article.slug} className="my-8">
        {<Markdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
          components={{
            p: ({ children }) => (
              hasOnlyImage(children) ? children as React.ReactElement :
              <p className="text-base font-normal my-2 mx-4 md:mx-0">{children}</p>
            ),
            h2: ({ children }) => <h2 className="text-lg font-bold mt-8 mb-4 mx-4 md:mx-0">{children}</h2>,
            a: ({ children, href }) => (href ?
              <Link href={href} target="_blank" className="text-blue-500">{children}</Link> :
              <span>{children}</span>
            ),
            img: ({ src, alt, className }) => {
              const isCaption = className && !className.indexOf('caption')
              const isTop = className && !className.indexOf('top')
              const isBottom = className && !className.indexOf('bottom')
              const pad = isCaption ? 'pt-4 pb-2' : isTop ? 'pt-4' : isBottom ? 'pb-4' : 'py-4'
              return (src && <div className={pad}>
                <Image src={src} caption={cameraCaptions.get(src) || ''} />
                {alt && <p className={`text-center text-sm italic text-gray-500 my-2 mx-4`}>{alt}</p>}
              </div>)
            },
            ul: ({ children }) => <ul className="my-4 mx-4 md:mx-0">{children}</ul>,
            li: ({ children }) => <li className="list-disc my-1 ml-5">{children}</li>,
            pre: ({ children }) => <pre className="my-4 p-4 bg-gray-100">{children}</pre>,
            code: ({ className, children }) => {
              const lang = className && className.split('-')[1]
              return className ?
                <div className="relative">
                  {lang && <p className="absolute right-0 top-[-8px] text-xs text-gray-500 text-right">{lang}</p>}
                  <SyntaxHighlighter
                    language={lang} style={github} className={codeFont.className}
                    customStyle={{ background: 'inherit', padding: 0 }}
                  >
                    {String(children)}
                  </SyntaxHighlighter> 
                </div>:
                <code className={`${codeFont.className} bg-gray-100 mx-0.5 px-1.5 py-0.5`}>{children}</code>
            },
            hr: () => <hr className="my-12 mx-auto w-72 h-1 bg-gray-300" />,
            blockquote: ({ children }) => <blockquote className="my-8 ml-6 md:ml-2 mr-4 md:mr-0 pl-1 md:pl-4 border-l-4 border-gray-300">{children}</blockquote>,
            table: ({ children }) => <table className="table-fixed ml-[-1px] mr-[-1px]">{children}</table>,
            td: ({ colSpan, children }) => <td colSpan={colSpan || 1} className="text-center text-sm italic text-gray-500">{children}</td>,
          }}
        >{article.content}</Markdown>}
      </div>

      <p className="text-sm text-gray-500 mt-16 mb-2 mx-4 md:mx-0 leading-6">
        <FaLocationDot className="text-base inline-block mr-2 pb-[2px]" />
        <Link href={`/locations/${article.location}`} className="text-blue-500">{article.location}</Link>
      </p>

      {uniqueCameras.length > 0 && <p className="text-sm text-gray-500 mt-2 mb-8 mx-4 md:mx-0 leading-6">
        <FaCamera className="text-base inline-block mr-2 pb-1" />
        {uniqueCameras.map((camera, i) => (<CameraLink key={i} camera={camera} />))}
      </p>}
    
      <div className="my-8 mx-4 md:mx-0 flex justify-between">
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
