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
      <body className={inter.className}>
        <CustomHead />
        {children}
      </body>
    </html>
  )
}