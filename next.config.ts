import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === 'true';
const basePath = isGithubPages ? '/DiaDelPadre' : '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  assetPrefix: isGithubPages ? '/DiaDelPadre/' : undefined,
  images: {
    loader: 'custom',
    loaderFile: './imageLoader.ts',
  },
};

export default nextConfig;
