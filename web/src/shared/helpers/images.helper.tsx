import getConfig from "next/config";

// Max dimensions for the preview thumbnail
const MAX_PREVIEW_SIZE = 300;

/**
 * Resizes an image file to create a smaller preview thumbnail
 * Uses createImageBitmap for better memory efficiency and performance
 */
export const createThumbnail = async (file: File): Promise<string> => {
  // Use createImageBitmap for better performance and memory handling
  // This decodes the image off the main thread when possible
  const bitmap = await createImageBitmap(file);

  let { width, height } = bitmap;

  // Calculate new dimensions while maintaining aspect ratio
  if (width > height) {
    if (width > MAX_PREVIEW_SIZE) {
      height = Math.round((height * MAX_PREVIEW_SIZE) / width);
      width = MAX_PREVIEW_SIZE;
    }
  } else {
    if (height > MAX_PREVIEW_SIZE) {
      width = Math.round((width * MAX_PREVIEW_SIZE) / height);
      height = MAX_PREVIEW_SIZE;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0, width, height);

  // Release the bitmap memory immediately after drawing
  bitmap.close();

  // Get the resized image as a data URL with moderate quality
  return canvas.toDataURL('image/jpeg', 0.7);
};

export function makeImageUrl(image, localUrl = false) {
  if (localUrl) {
    return image
  }
  const { publicRuntimeConfig } = getConfig()

  if (!image) {
    return `${publicRuntimeConfig.apiUrl}/networks/logo/192`;
  }
  const regex = /^data\:image/gm;
  const matches = image.match(regex);
  if (!matches) {
    const regexHref = /^(http|https)/gm;
    if (image.match(regexHref)) {
      return image;
    }
    return `${publicRuntimeConfig.apiUrl}${image}`;
  }
  return image;
}