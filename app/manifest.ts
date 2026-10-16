import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'きたじー | KITAJI',
    short_name: 'KITAJI',
    description:
      'Portfolio of Kitaji (きたじー / KITAJI) — Software Engineer / SRE based in Japan.',
    start_url: '/',
    display: 'standalone',
    background_color: '#090c1b',
    theme_color: '#090c1b',
    icons: [{ src: '/icon.jpg', sizes: '800x800', type: 'image/jpeg' }],
  }
}
