import type { Metadata } from 'next'
import { Providers } from '../components/providers'

export const metadata: Metadata = {
  title: 'Booth Like',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
