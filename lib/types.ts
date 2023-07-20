import { ReadTimeResults } from 'reading-time'

export interface BlogSlug {
  title: string
  summary: string
  date: string
  draft: boolean
  slug: string
  tags: string[]
}

export interface Toc {
  value: string
  depth: number
  url: string
}

export interface BundledMdx<TFrontMatter> {
  mdxSource: string
  toc: Toc[]
  frontMatter: TFrontMatter
}

export interface AuthorFrontMatter {
  name: string
  avatar: string
  occupation: string
  company: string
  email: string
  linkedin: string
  github: string
}

export interface PostFrontMatter {
  title: string
  readingTime: ReadTimeResults
  date: string
  tags: string[]
  lastmod?: string
  draft?: boolean
  summary?: string
  images?: string[]
  authors?: string[]
  layout?: string
  canonicalUrl?: string
  slug: string
  fileName: string
  url: string
  filePath: string
}

export interface BlogWithPaginationInfo {
  idx: number
  blog: PostFrontMatter
  nextBlog: PostFrontMatter | null
  prevBlog: PostFrontMatter | null
}
