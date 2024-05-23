module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/docs/introduction',
        permanent: false,
      },
      {
        source: '/docs/',
        destination: '/docs/introduction',
        permanent: false,
      },
      {
        source: '/admin',
        destination: '/admin/index.html',
        permanent: false,
      },
    ]
  },
  trailingSlash: true,
}
