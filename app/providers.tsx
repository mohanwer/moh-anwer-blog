'use client'
import { ThemeProvider } from 'next-themes'
import { PropsWithChildren } from 'react'
import { siteMetadata } from '@/data/siteMetaData'

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme}>
      {children}
    </ThemeProvider>
  )
}
