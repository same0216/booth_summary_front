import type { Metadata } from 'next'
import { Providers } from '../components/providers'
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: 'booth-summary-front',
  description: 'BoothのVRchatアイテムに特化した情報サイト',
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
        <Analytics />
      </body>
    </html>
  )
}
