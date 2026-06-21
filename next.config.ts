import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === 'true';
const basePath = isGithubPages ? '/DiaDelPadre' : '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  assetPrefix: isGithubPages ? '/DiaDelPadre/' : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    loader: 'custom',
    loaderFile: './imageLoader.ts',
  },
};

export default nextConfig;
