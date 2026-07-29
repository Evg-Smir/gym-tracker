import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Gym Tracker',
    short_name: 'Gym Tracker',
    description: 'Учёт силовых тренировок: подходы, прогресс и статистика',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#F2F2F7FF',
    theme_color: '#F2F2F7FF',
    icons: [
      {
        src: '/ui/logo.png',
        sizes: '285x285',
        type: 'image/png',
      },
    ],
  }
}
