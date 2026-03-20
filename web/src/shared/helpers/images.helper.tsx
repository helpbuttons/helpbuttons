import getConfig from "next/config";

// Max dimensions for the preview thumbnail
const MAX_PREVIEW_SIZE = 300;

/**
 * Resizes an image file to create a smaller preview thumbnail
 * This helps prevent browser slowdowns when handling large image uploads
 */
export const createThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

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

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Get the resized image as a data URL with moderate quality
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function makeImageUrl(image, localUrl = false) {
    if(localUrl)
    {
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