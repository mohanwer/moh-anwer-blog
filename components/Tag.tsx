import { slug } from 'github-slugger'
import Link from 'next/link'

interface Props {
  text: string
}

export const kebabCase = (text: string) => slug(text)

export function Tag({ text }: Props) {
  return (
    <Link
      href={`/tags/${kebabCase(text)}`}
      className="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
    >
      {text.split(' ').join('-')}
    </Link>
  )
}
