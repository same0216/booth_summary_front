import type { Metadata } from 'next'
import { Providers } from '../components/providers'

export const metadata: Metadata = {
  title: 'booth-summary-front',
  description: 'BoothのVRchatアイテムに特化した分析サイト',
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
