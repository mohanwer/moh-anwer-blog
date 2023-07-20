import Github from './github.svg'
import Linkedin from './linkedin.svg'
import Mail from './mail.svg'
import React from 'react'
import Link from 'next/link'

const components = {
  mail: Mail,
  github: Github,
  linkedin: Linkedin,
}

export interface SocialIconProps {
  kind: keyof typeof components
  href: string
  size?: number
}

export default function SocialIcon({ kind, href, size = 2 }: SocialIconProps) {
  const SocialSvg = components[kind] as React.ComponentType<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >

  return (
    <Link
      className="text-sm text-gray-500 transition hover:text-gray-600"
      target="_blank"
      rel={'noopener nonreferrer'}
      href={href}
    >
      <span className="sr-only">{kind}</span>
      <SocialSvg
        className={`fill-current text-gray-700 hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-400`}
        style={{
          width: `${size}rem`,
          height: `${size}rem`,
        }}
      />
    </Link>
  )
}
