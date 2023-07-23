import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import { BlogWithPaginationInfo, PostFrontMatter } from './types'
import { BLOG_PATH } from '@/constants'
import readingTime from 'reading-time'

const BLOG_FILE_TYPES = new Set(['.md', '.mdx'])

export function getAllFilesRecursively(folder: string): string[] {
  const dirs = fs.readdirSync(folder, { withFileTypes: true })
  const filesMatchingExtension: string[] = []
  dirs.forEach((dir) => {
    if (dir.isDirectory()) {
      filesMatchingExtension.push(...getAllFilesRecursively(path.join(folder, dir.name)))
    } else {
      const fileName = dir.name.replace(/\\/g, '/')
      const fileExtension = path.extname(fileName)
      if (BLOG_FILE_TYPES.has(fileExtension)) {
        const filePath = path.join(folder, dir.name)
        filesMatchingExtension.push(filePath)
      }
    }
  })
  return filesMatchingExtension
}

export function mapFrontMatter<TFrontMatter>(filePath: string): TFrontMatter {
  const source = fs.readFileSync(filePath, 'utf-8')
  const { data: frontMatter } = matter(source)
  // @ts-ignore
  return {
    readingTime: readingTime(source),
    filePath,
    fileName: filePath.replace(/^.*[\\]/, ''),
    slug: filePath.replace(/.(mdx|md)/, ''),
    date: frontMatter.date.toString(),
    ...frontMatter,
  }
}

export function getAllFilesFrontMatter<TFrontMatter>(folder: string): TFrontMatter[] {
  const files = getAllFilesRecursively(folder)
  return files.map(mapFrontMatter<TFrontMatter>)
}

export function getBlogWithPrevAndNext(blogUrl: string): BlogWithPaginationInfo {
  const files = getAllFilesRecursively(BLOG_PATH)
  let prevBlog: PostFrontMatter | null = null
  let nextBlog: PostFrontMatter | null = null
  let blog: PostFrontMatter
  let blogIndex: number = -1
  let filePath = ''
  files.forEach((file, idx) => {
    prevBlog = blog
    blog = mapFrontMatter<PostFrontMatter>(file)
    const { url } = blog
    if (url === blogUrl) {
      blogIndex = idx
      filePath = file
      return
    }
  })
  if (blogIndex === -1 || filePath === '') {
    throw Error(`${blogUrl} could not be found`)
  }
  if (blogIndex < files.length - 1) {
    nextBlog = mapFrontMatter(files[blogIndex + 1])
  }
  blog = mapFrontMatter(filePath)
  return {
    idx: blogIndex,
    nextBlog,
    blog,
    prevBlog,
  }
}
