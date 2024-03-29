/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/', // リダイレクト元のURL
        destination: '/login', // リダイレクト先のURL
        permanent: true, // 永続的なリダイレクトかのフラグ
      },
    ]
  },
  env: {
    API_ORIGIN: "https://api.5573.me/"
  },
}

module.exports = nextConfig
