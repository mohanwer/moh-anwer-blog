import React, { PropsWithChildren } from 'react'
import Link from 'next/link'
import headerNavLinks from '@/headerNavLinks'
import NavBar from '@/NavBar'

function HeaderNavLinks() {
  return (
    <div className="hidden sm:block">
      {headerNavLinks.map((navLink) => (
        <Link
          key={navLink.title}
          href={navLink.href}
          className="p-1 font-medium text-gray-900 dark:text-gray-100 sm:p-4"
        >
          {navLink.title}
        </Link>
      ))}
    </div>
  )
}

export default function LayoutWrapper({ children }: PropsWithChildren) {
  return (
    <>
      <NavBar />
      <main className="mb-auto">{children}</main>
    </>
  )
}
