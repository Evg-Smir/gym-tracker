/** App base path for GitHub Pages (`/gym-tracker` in production, empty in dev). */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const withBasePath = (path: string) => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalized}`;
};
