// src/utils/optimizeImage.js

/**
 * Injects Cloudinary transformation params into an existing Cloudinary URL
 * to serve a smaller, web-optimized version instead of the original full-size file.
 *
 * @param {string} url - original image URL
 * @param {number} width - target width in px (default 500)
 * @returns {string} optimized URL (or original URL if not a Cloudinary link)
 */
export function optimizeImage(url, width = 500) {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com')) return url;
  if (url.includes('/upload/w_')) return url;

  return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
}