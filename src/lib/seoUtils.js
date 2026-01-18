
export const BASE_URL = "https://siteadresim.com";

export const generatePageTitle = (title) => {
  return title;
};

export const generateMetaDescription = (text) => {
  if (!text) return "";
  // Truncate if necessary (standard SEO best practice is around 160 chars)
  return text.length > 160 ? text.substring(0, 157) + "..." : text;
};

export const getCanonicalUrl = (path) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${cleanPath === '/' ? '' : cleanPath}`;
};
