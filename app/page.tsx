import { getAllFilesFrontMatter } from '@/fileUtils'
import { BLOG_PATH } from '@/constants'
import { PostFrontMatter } from '@/types'
import BlogPage from '@/blog/page'

async function getData() {
  const blogPosts = getAllFilesFrontMatter<PostFrontMatter>(BLOG_PATH)
  if (!blogPosts) {
    return []
  }

  return blogPosts
}

export default async function Page() {
  return <BlogPage />
}
