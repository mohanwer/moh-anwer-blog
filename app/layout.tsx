import './globals.css'
import '../css/tailwind.css'
import '../css/prism.css'
import 'katex/dist/katex.css'

import React from 'react'
import NavBar from '@/NavBar'
import { Providers } from '@/providers'
import SectionContainer from '@/SectionContainer'
import MobileNav from '@/MobileNav'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true} className="scroll-smooth">
      <head>
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
      </head>
      <body>
        <SectionContainer>
          <Providers>
            <NavBar />
            <MobileNav />
            {children}
          </Providers>
        </SectionContainer>
      </body>
    </html>
  )
}
