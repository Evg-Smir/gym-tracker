/** @type {import('next').NextConfig} */
const repoName = 'gym-tracker';
const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? `/${repoName}` : '';

const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
