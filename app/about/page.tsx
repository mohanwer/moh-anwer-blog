import { AUTHOR_PATH } from '@/constants'
import { getSlugAsBundledMdx } from '@/mdxUtils'
import { AuthorFrontMatter } from '@/types'
import SectionContainer from '@/SectionContainer'
import { getMDXComponent } from 'mdx-bundler/client'
import React from 'react'

const authorPath = `${AUTHOR_PATH}/mohammad_anwer.md`

export default async function Page() {
  const blogBundledMdx = await getSlugAsBundledMdx<AuthorFrontMatter>(authorPath)
  const { mdxSource, toc, frontMatter } = blogBundledMdx
  const Component = getMDXComponent(mdxSource)

  return (
    <SectionContainer>
      <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
        <div className="prose max-w-none pb-8 pt-10 dark:prose-dark">
          <Component />
        </div>
      </div>
    </SectionContainer>
  )
}
