import './globals.css'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import CustomHead from './head'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <CustomHead />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
