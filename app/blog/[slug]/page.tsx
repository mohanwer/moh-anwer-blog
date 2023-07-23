import { getAllFilesFrontMatter, getBlogWithPrevAndNext } from '@/fileUtils'
import { getSlugAsBundledMdx } from '@/mdxUtils'
import { AuthorFrontMatter, BundledMdx, PostFrontMatter } from '@/types'
import React from 'react'
import PageTitle from '@/PageTitle'
import { AUTHOR_PATH, BLOG_PATH } from '@/constants'
import SectionContainer from '@/SectionContainer'
import { siteMetadata } from '@/data/siteMetaData'
import Link from 'next/link'
import NextImage from 'next/image'
import { Tag } from '@/Tag'
import path from 'path'
import { getMDXComponent } from 'mdx-bundler/client'

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

type AuthorBundle = BundledMdx<AuthorFrontMatter>

const getAuthorsBundledMdx = async (authors: string[]): Promise<AuthorBundle[]> => {
  const authorPromises = authors.map((author) => {
    const authorNoSpaces = author.replaceAll(' ', '_').toLowerCase()
    const authFilePath = path.join(AUTHOR_PATH, authorNoSpaces + '.md')
    return getSlugAsBundledMdx<AuthorFrontMatter>(authFilePath)
  })
  return await Promise.all(authorPromises)
}

export function generateStaticParams(): { slug: string }[] {
  return getAllFilesFrontMatter<PostFrontMatter>(BLOG_PATH).map((blog) => {
    return { slug: blog.url }
  })
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params
  const { blog, nextBlog, prevBlog } = getBlogWithPrevAndNext(slug)
  const { filePath, authors } = blog
  const blogBundledMdx = await getSlugAsBundledMdx<PostFrontMatter>(filePath)
  const authorDetails = authors ? await getAuthorsBundledMdx(authors) : []
  const { mdxSource, toc, frontMatter } = blogBundledMdx
  const { date, title, tags } = frontMatter
  const Component = getMDXComponent(mdxSource)

  if (frontMatter.draft) {
    return (
      <div className="mt-24 text-center">
        <PageTitle>
          Under Construction{' '}
          <span role="img" aria-label="roadwork sign">
            🚧
          </span>
        </PageTitle>
      </div>
    )
  }

  return (
    <SectionContainer>
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 xl:pb-6">
            <div className="space-y-1 text-center">
              <dl className="space-y-10">
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    <time dateTime={date}>
                      {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                    </time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>

          <div
            className="divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0"
            style={{ gridTemplateRows: 'auto 1fr' }}
          >
            {authorDetails.length > 0 ? (
              <dl className="pb-10 pt-6 xl:border-b xl:border-gray-200 xl:pt-11 xl:dark:border-gray-700">
                <dt className="sr-only">Authors</dt>
                <dd>
                  <ul className="flex justify-center space-x-8 sm:space-x-12 xl:block xl:space-x-0 xl:space-y-8">
                    {authorDetails.map((author) => (
                      <li className="flex items-center space-x-2" key={author.frontMatter.name}>
                        {author.frontMatter.avatar && (
                          <NextImage
                            src={author.frontMatter.avatar}
                            width="38"
                            height="38"
                            alt="avatar"
                            className="h-10 w-10 rounded-full"
                          />
                        )}
                        <dl className="whitespace-nowrap text-sm font-medium leading-5">
                          <dt className="sr-only">Name</dt>
                          <dd className="text-gray-900 dark:text-gray-100">
                            {author.frontMatter.name}
                          </dd>
                        </dl>
                      </li>
                    ))}
                  </ul>
                </dd>
              </dl>
            ) : (
              <></>
            )}
            <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none pb-8 pt-10 dark:prose-dark">
                <Component toc={toc} />
              </div>
            </div>
          </div>
          <footer>
            <div className="divide-gray-200 text-sm font-medium leading-5 dark:divide-gray-700 xl:col-start-1 xl:row-start-2 xl:divide-y">
              {tags && (
                <div className="py-4 xl:py-8">
                  <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Tags
                  </h2>
                  <div className="flex flex-wrap">
                    {tags.map((tag) => (
                      <Tag key={tag} text={tag} />
                    ))}
                  </div>
                </div>
              )}
              {(nextBlog || prevBlog) && (
                <div className="flex justify-between py-4 xl:block xl:space-y-8 xl:py-8">
                  {prevBlog && (
                    <div>
                      <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Previous Article
                      </h2>
                      <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                        <Link href={`/blog/${prevBlog.url}`}>{prevBlog.title}</Link>
                      </div>
                    </div>
                  )}
                  {nextBlog && (
                    <div>
                      <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Next Article
                      </h2>
                      <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                        <Link href={`/blog/${nextBlog.url}`}>{nextBlog.title}</Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="pt-4 xl:pt-8">
              <Link
                href="/blog"
                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              >
                &larr; Back to the blog
              </Link>
            </div>
          </footer>
        </div>
      </article>
    </SectionContainer>
  )
}
