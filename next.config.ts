import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isProd ? '/DiaDelPadre' : '',
  assetPrefix: isProd ? '/DiaDelPadre/' : '',
  images: {
    loader: 'custom',
    loaderFile: './imageLoader.ts',
  },
};

export default nextConfig;
