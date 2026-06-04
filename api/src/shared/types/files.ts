import { extname } from "path";

// Allowed image types for web (standard formats)
export const allowedImageTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/heic',
    'image/heif',
    'image/avif',
  ];
  
  // Allowed image extensions
  export const allowedImageExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.heic',
    '.heif',
    '.avif',
  ];
  
  // Allowed video types
  export const allowedVideoTypes = [
    'video/webm',
    'video/mp4',
    'video/m4v',
    'video/quicktime',
  ];
  
  // Allowed video extensions
  export const allowedVideoExtensions = [
    '.webm',
    '.mp4',
    '.m4v',
    '.mov',
  ];
  
// Output format for images (web standard)
export const imageOutputFormat = 'webp';
export const imageOutputQuality = 80;
export const imageMaxDimension = 1920;


export const fileFilter = (filename, allowed_extensions) => {
  const ext = getFileExtension(filename);
  if (allowed_extensions.includes(ext)) {
    return true;
  } else {
    return false;
  }
};


export const getFileExtension = (filename: string): string => {
  return extname(filename).toLowerCase();
};

export const parseSizeToBytes = (sizeString: string): number => {
  if (!sizeString) return 0;
  const match = sizeString.match(/^(\d+)([KMG]?)$/i);
  if (!match) return 0;
  const value = parseInt(match[1], 10);
  const unit = match[2]?.toUpperCase() || '';
  switch (unit) {
    case 'K': return value * 1024;
    case 'M': return value * 1024 * 1024;
    case 'G': return value * 1024 * 1024 * 1024;
    default: return value;
  }
};