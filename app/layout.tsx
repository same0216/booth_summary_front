import './globals.css'
import Head from "next/head";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Head>
        <title>ずんだもん</title>
        <link rel="stylesheet" href="fonts/font.css" />
      </Head>
      <html lang="ja">
        <body>
          {children}
        </body>
      </html>
    </>
  )
}