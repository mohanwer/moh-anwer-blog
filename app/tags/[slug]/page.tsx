import { getAllFilesFrontMatter } from '@/fileUtils'
import { PostFrontMatter } from '@/types'
import { BLOG_PATH } from '@/constants'
import { PageSEO } from '@/seo/PageSEO'
import { siteMetadata } from '@/data/siteMetaData'
import ListLayout from '@/layouts/ListLayout'

const POSTS_PER_PAGE = 5

function generateStaticParams(): { slug: string }[] {
  const tags: string[] = []
  getAllFilesFrontMatter<PostFrontMatter>(BLOG_PATH).forEach((blog) =>
    blog.tags.forEach((t) => tags.push(t))
  )

  return tags.map((t) => {
    return { slug: t }
  })
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params
  const posts = getAllFilesFrontMatter<PostFrontMatter>(BLOG_PATH).filter((fm) =>
    fm.tags.some((t) => t === slug)
  )
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(initialDisplayPosts.length / POSTS_PER_PAGE),
  }
  return (
    <>
      <PageSEO
        title={`Blog - ${siteMetadata.author}`}
        description={siteMetadata.description}
        path={'/blog'}
      />
      <ListLayout
        title="All Posts"
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
      />
    </>
  )
}
