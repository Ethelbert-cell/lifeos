import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LifeOS',
    short_name: 'LifeOS',
    description: 'Transform your life into an RPG.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#020617', // tailwind slate-950
    theme_color: '#4f46e5', // tailwind indigo-600
    icons: [
      {
        src: '/favicon.ico',
        sizes: '192x192 512x512',
        type: 'image/x-icon',
      },
    ],
  };
}
