import { BadRequestException } from "@nestjs/common";
import { allowedImageExtensions, allowedVideoExtensions, fileFilter } from "@src/shared/types/files";
import { extname } from "path";
export const uploadDir = './uploads/';
export const getFilesRoute = '/files/get/';



export const videoImageFilter = (req, file, callback) => {
  const isAllowedVideo = fileFilter( file.originalname, allowedImageExtensions) || fileFilter( file.originalname, allowedVideoExtensions) 

  if (isAllowedVideo) {
    callback(null, true);
  } else {
    callback(new BadRequestException(
      `Invalid file type. Allowed: ${[...allowedImageExtensions, ...allowedVideoExtensions].join(', ')}`
    ), false);
  }
}

export const imageFileFilter = (req, file, callback) => {

  const isAllowedImage = fileFilter( file.originalname, allowedImageExtensions)

  if (isAllowedImage) {
    callback(null, true);
  } else {
    callback(new BadRequestException(
      `Invalid file type. Allowed: ${[...allowedImageExtensions].join(', ')}`
    ), false);
  }
}
  
export const editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(10)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
  };
