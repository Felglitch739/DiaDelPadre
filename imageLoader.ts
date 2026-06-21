export default function myImageLoader({ src }: { src: string }) {
  const isGithubPages = process.env.GITHUB_PAGES === 'true';
  const basePath = isGithubPages ? '/DiaDelPadre' : '';
  
  // If the src already includes the basePath, don't duplicate it
  if (basePath && src.startsWith(basePath)) {
    return src;
  }
  
  return `${basePath}${src}`;
}
