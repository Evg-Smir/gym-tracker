import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GYM tracker',
    short_name: 'GYM_tracker',
    description: 'Helper for your workout',
    start_url: '/',
    display: 'standalone',
    background_color: '#F2F2F7FF',
    theme_color: '#000000',
    icons: [
      {
        src: '/ui/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/ui/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
