export default function myImageLoader({ src }: { src: string }) {
  const isProd = process.env.NODE_ENV === 'production';
  const basePath = isProd ? '/DiaDelPadre' : '';
  
  // If the src already starts with the basePath (e.g., from Next.js internal routing), don't add it again
  if (src.startsWith(basePath)) {
    return src;
  }
  
  return `${basePath}${src}`;
}
