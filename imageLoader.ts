export default function myImageLoader({ src }: { src: string }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  
  // If the src already includes the basePath, don't duplicate it
  if (basePath && src.startsWith(basePath)) {
    return src;
  }
  
  return `${basePath}${src}`;
}
