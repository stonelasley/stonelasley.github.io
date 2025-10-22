/**
 * Cloudinary image transformation utilities
 */

/**
 * Adds transformation parameters to a Cloudinary image URL
 * @param url - Original Cloudinary URL
 * @param transformations - Transformation parameters to apply
 * @returns Transformed URL
 */
export function addCloudinaryTransformations(
  url: string,
  transformations: string
): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{path}
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) {
    return url;
  }

  const beforeUpload = url.substring(0, uploadIndex + 8); // includes '/upload/'
  const afterUpload = url.substring(uploadIndex + 8);

  return `${beforeUpload}${transformations}/${afterUpload}`;
}

/**
 * Optimizes a Cloudinary image URL with common transformations
 * @param url - Original Cloudinary URL
 * @param options - Optimization options
 * @returns Optimized URL
 */
export function optimizeCloudinaryImage(
  url: string,
  options?: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: 'fill' | 'fit' | 'scale' | 'limit';
  }
): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const transformations: string[] = [];

  // Add resize parameters
  if (options?.width) {
    transformations.push(`w_${options.width}`);
  }
  if (options?.height) {
    transformations.push(`h_${options.height}`);
  }
  if (options?.crop) {
    transformations.push(`c_${options.crop}`);
  }

  // Add quality parameter
  if (options?.quality === 'auto') {
    transformations.push('q_auto');
  } else if (typeof options?.quality === 'number') {
    transformations.push(`q_${options.quality}`);
  }

  // Add format parameter
  if (options?.format === 'auto') {
    transformations.push('f_auto');
  } else if (options?.format) {
    transformations.push(`f_${options.format}`);
  }

  // If no transformations specified, use defaults
  if (transformations.length === 0) {
    transformations.push('q_auto', 'f_auto');
  }

  return addCloudinaryTransformations(url, transformations.join(','));
}

/**
 * Preset transformations for different image contexts
 */
export const CLOUDINARY_PRESETS = {
  /** Recipe card thumbnail - optimized for list view */
  recipeCard: (url: string) =>
    optimizeCloudinaryImage(url, {
      width: 800,
      quality: 'auto',
      format: 'auto',
      crop: 'limit',
    }),

  /** Recipe hero image - full width on detail page */
  recipeHero: (url: string) =>
    optimizeCloudinaryImage(url, {
      width: 1200,
      quality: 'auto',
      format: 'auto',
      crop: 'limit',
    }),

  /** Blog post image */
  blogImage: (url: string) =>
    optimizeCloudinaryImage(url, {
      width: 1000,
      quality: 'auto',
      format: 'auto',
      crop: 'limit',
    }),
};
