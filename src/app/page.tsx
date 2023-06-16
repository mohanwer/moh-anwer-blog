import Image from 'next/image'
import { PageSEO } from '@/components/seo/PageSEO'
import { siteMetadata } from '@/data/siteMetaData'
import { getAllFilesFrontMatter } from '../../lib/fileUtils'

function Posts() {
  const blogPosts = getAllFilesFrontMatter('data')

  if (!blogPosts) {
    return <>'No posts found'</>
  }
}
export default function Page() {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <h1>Hello, Dashboard Page!</h1>
    </>
  )
}
