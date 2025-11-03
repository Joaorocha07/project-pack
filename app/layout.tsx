import './globals.css'
import { Inter } from 'next/font/google'
import CustomHead from './head'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}