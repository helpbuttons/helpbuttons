import { BadRequestException } from "@nestjs/common";
import { extname } from "path";
export const uploadDir = './uploads/';
export const getFilesRoute = '/files/get/';

// Allowed image types for web (standard formats)
export const ALLOWED_IMAGE_TYPES = [
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
export const ALLOWED_IMAGE_EXTENSIONS = [
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
export const ALLOWED_VIDEO_TYPES = [
  'video/webm',
  'video/mp4',
  'video/m4v',
  'video/quicktime',
];

// Allowed video extensions
export const ALLOWED_VIDEO_EXTENSIONS = [
  '.webm',
  '.mp4',
  '.m4v',
  '.mov',
];

// Output format for images (web standard)
export const IMAGE_OUTPUT_FORMAT = 'webp';
export const IMAGE_OUTPUT_QUALITY = 80;
export const IMAGE_MAX_DIMENSION = 1920;


export const videoImageFilter = (req, file, callback) => {
  const isAllowedVideo = fileFilter( file, ALLOWED_IMAGE_EXTENSIONS) || fileFilter( file, ALLOWED_VIDEO_EXTENSIONS) 

  if (isAllowedVideo) {
    callback(null, true);
  } else {
    callback(new BadRequestException(
      `Invalid file type. Allowed: ${[...ALLOWED_IMAGE_EXTENSIONS, ...ALLOWED_VIDEO_EXTENSIONS].join(', ')}`
    ), false);
  }
}

export const imageFileFilter = (req, file, callback) => {

  const isAllowedImage = fileFilter( file, ALLOWED_IMAGE_EXTENSIONS)

  if (isAllowedImage) {
    callback(null, true);
  } else {
    callback(new BadRequestException(
      `Invalid file type. Allowed: ${[...ALLOWED_IMAGE_EXTENSIONS].join(', ')}`
    ), false);
  }
}

const fileFilter = (file, allowed_extensions) => {
  const ext = getFileExtension(file.originalname);
  if (allowed_extensions.includes(ext)) {
    return true;
  } else {
    return false;
  }
};
  
export const editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(10)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
  };

export const getFileExtension = (filename: string): string => {
  return extname(filename).toLowerCase();
};