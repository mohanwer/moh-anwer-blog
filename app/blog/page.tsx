import ListLayout from '@/layouts/ListLayout'
import { getAllFilesFrontMatter } from '@/fileUtils'
import { BLOG_PATH } from '@/constants'
import { PageSEO } from '@/seo/PageSEO'
import { siteMetadata } from '@/data/siteMetaData'
import { PostFrontMatter } from '@/types'

const POSTS_PER_PAGE = 5

export default function BlogPage() {
  const posts = getAllFilesFrontMatter<PostFrontMatter>(BLOG_PATH)
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE)
  const pagination = { currentPage: 1, totalPages: Math.ceil(posts.length / POSTS_PER_PAGE) }
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
