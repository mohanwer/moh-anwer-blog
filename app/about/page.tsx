import { AUTHOR_PATH } from '@/constants'
import { getSlugAsBundledMdx } from '@/mdxUtils'
import { AuthorFrontMatter } from '@/types'
import { getMDXComponent } from 'mdx-bundler/client'
import React from 'react'
import { PageSEO } from '@/seo/PageSEO'
import Image from '@/Image'
import SocialIcon from '@/social-icons'

const authorPath = `${AUTHOR_PATH}/mohammad_anwer.md`

export default async function Page() {
  const blogBundledMdx = await getSlugAsBundledMdx<AuthorFrontMatter>(authorPath)
  const { name, avatar, occupation, company, email, linkedin, github } = blogBundledMdx.frontMatter
  const { mdxSource } = blogBundledMdx
  const Component = getMDXComponent(mdxSource)

  return (
    <>
      <PageSEO title={`About - ${name}`} description={`About me - ${name}`} path={'/blog'} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            About
          </h1>
        </div>
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
          <div className="flex flex-col items-center pt-8">
            <Image
              src={avatar}
              alt="avatar"
              width="192"
              height="192"
              className="h-48 w-48 rounded-full"
            />
            <h3 className="pb-2 pt-4 text-2xl font-bold leading-8 tracking-tight">{name}</h3>
            <div className="text-gray-500 dark:text-gray-400">{occupation}</div>
            <div className="text-gray-500 dark:text-gray-400">{company}</div>
            <div className="flex space-x-3 pt-6">
              <SocialIcon kind="mail" href={`mailto:${email}`} />
              <SocialIcon kind="github" href={github} />
              <SocialIcon kind="linkedin" href={linkedin} />
            </div>
          </div>
          <div className="prose max-w-none pb-8 pt-8 dark:prose-dark xl:col-span-2">
            <Component />
          </div>
        </div>
      </div>
    </>
  )
}
