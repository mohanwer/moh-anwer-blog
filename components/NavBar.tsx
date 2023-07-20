import Link from 'next/link'
import { siteMetadata } from '@/data/siteMetaData'
import ThemeSwitch from '@/ThemeSwitch'

export function NavBar() {
  return (
    <nav className="flex flex-wrap items-center justify-between p-6 bg-blend-color">
      <div className="mr-6 flex flex-shrink-0 items-center text-white">
        <span className="text-xl font-semibold tracking-tight">Sarim Anwer's blog</span>
      </div>
      <div className="block lg:hidden">
        <button className="flex items-center rounded border border-teal-400 px-3 py-2 text-teal-200 hover:border-white hover:text-white">
          <svg
            className="h-3 w-3 fill-current"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div className="block w-full flex-grow lg:flex lg:w-auto lg:items-center">
        <div className="text-sm lg:flex-grow">
          <Link
            href="/blog"
            className="mr-4 mt-4 block text-teal-200 hover:text-white lg:mt-0 lg:inline-block"
          >
            Blog posts
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default function Nav() {
  return (
    <div className="flex flex-col justify-between">
      <header className="flex items-center justify-between py-10">
        <Link href={'/'} aria-label={siteMetadata.headerTitle}>
          <div className="hidden text-2xl font-semibold sm:block">{siteMetadata.headerTitle}</div>
        </Link>
        <div className="flex items-center text-base leading-5">
          <div className="hidden sm:block">
            <Link href="/blog" className="p-1 font-medium text-gray-900 dark:text-gray-100 sm:p-4">
              Blog posts
            </Link>
            <Link href="/about" className="p-1 font-medium text-gray-900 dark:text-gray-100 sm:p-4">
              About
            </Link>
            <ThemeSwitch />
          </div>
        </div>
      </header>
    </div>
  )
}
