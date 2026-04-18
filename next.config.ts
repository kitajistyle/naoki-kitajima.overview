import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false, // GSAPアニメーションとの互換性のため無効化
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/404',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
