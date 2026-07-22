// src/utils/optimizeImage.js

/**
 * Injects Cloudinary auto-optimization + responsive sizing into a URL.
 * f_auto -> serves WebP/AVIF automatically based on browser support
 * q_auto -> Cloudinary picks the smallest quality that looks visually identical
 * dpr_auto -> serves 2x/3x assets only on high-DPI screens, not by default
 * c_fill  -> crops to the exact box instead of shipping oversized originals
 */
export function optimizeImage(url, { width = 500, height, crop = "fill" } = {}) {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com")) return url;
  if (url.includes("/upload/f_auto")) return url; // already optimized

  const dims = height ? `w_${width},h_${height},c_${crop}` : `w_${width},c_${crop}`;
  const transform = `f_auto,q_auto,dpr_auto,${dims}`;
  return url.replace("/upload/", `/upload/${transform}/`);
}

/**
 * Builds a srcSet for responsive delivery — mobile gets a small file,
 * desktop gets a larger one, instead of everyone downloading the same size.
 */
export function buildSrcSet(url, widths = [300, 500, 800, 1200]) {
  if (!url || !url.includes("res.cloudinary.com")) return undefined;
  return widths.map((w) => `${optimizeImage(url, { width: w })} ${w}w`).join(", ");
}