import path from 'path'
import * as fs from 'fs'
import matter from 'gray-matter'
import { Slug } from './types'

const BLOG_FILE_TYPES = new Set(['.md', '.mdx'])
const root = process.cwd()

export function getAllFilesRecursively(folder: string): string[] {
  const dirs = fs.readdirSync(folder, { withFileTypes: true })
  const filesMatchingExtension: string[] = []
  dirs.forEach((dir) => {
    if (dir.isDirectory()) {
      filesMatchingExtension.push(...getAllFilesRecursively(path.join(folder, dir.name)))
    } else {
      const fileExtension = path.extname(dir.name)
      if (BLOG_FILE_TYPES.has(fileExtension)) {
        const filePath = path.join(folder, dir.name)
        filesMatchingExtension.push(filePath)
      }
    }
  })
  return filesMatchingExtension
}

export function getAllFilesFrontMatter(folder: string): Slug[] {
  const blogDir = path.join(root, 'data')
  const files = getAllFilesRecursively(blogDir)
  const activeFrontMatter: Slug[] = []
  files.forEach((file) => {
    const source = fs.readFileSync(file, 'utf-8')
    const { data: frontMatter } = matter(source)
    if (!frontMatter.draft) {
      activeFrontMatter.push({
        title: frontMatter.title,
        summary: frontMatter.summary,
        draft: frontMatter.draft,
        slug: file.replace(/\.(mdx|md)/, ''),
        date: new Date(frontMatter.date),
      })
    }
  })

  return activeFrontMatter.sort((a, b) => {
    if (a == b) return 0
    if (a > b) return -1
    return 1
  })
}
