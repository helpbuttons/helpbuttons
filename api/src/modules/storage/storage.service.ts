import {
  Injectable,
  BadRequestException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { uuid } from '@src/shared/helpers/uuid.helper';
import { Repository } from 'typeorm';
import { ImageFile } from './image-file.entity';
import { 
  getFilesRoute, 
  uploadDir,
} from './storage.utils';
import {
  allowedImageTypes,
  allowedImageExtensions,
  allowedVideoTypes,
  allowedVideoExtensions,
  imageOutputFormat,
  imageOutputQuality,
  imageMaxDimension,
  getFileExtension,
  parseSizeToBytes,
} from '@src/shared/types/files';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { CustomHttpException } from '@src/shared/middlewares/errors/custom-http-exception.middleware';
import { ErrorName } from '@src/shared/types/error.list';
import configs from '@src/config/configuration';

const getMaxUploadSizeBytes = (): number => {
  const sizeString = configs().maxUploadSize;
  return parseSizeToBytes(sizeString);
};

export interface UploadResult {
  id: string;
  name: string;
  mimetype: string;
  originalname: string;
  size: number;
  converted?: boolean;
}

export interface ImageConvertOptions {
  format?: 'webp' | 'jpeg' | 'png' | 'avif' | 'jpg';
  quality?: number;
  maxDimension?: number;
}

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(ImageFile)
    private readonly imageFilesRepository: Repository<ImageFile>,
  ) {}

  /**
   * Check if the upload directory is writable
   * @returns Promise<boolean> true if writable, false otherwise
   */
  async isUploadDirWritable(): Promise<boolean> {
    try {
      await fs.promises.access(uploadDir, fs.constants.W_OK);
      return true;
    } catch (error) {
      throw new CustomHttpException(
        ErrorName.UploadNotWritable,
      );
    }
  }

  /**
   * Upload and convert image to web standard format
   * Endpoint: POST /files/upload/image
   * Accepts: .jpg, .jpeg, .png, .gif, .webp, .heic, .heif, .avif
   * Returns: .webp (or configured format)
   */
  async uploadAndConvertImage(
    file: Express.Multer.File,
    options: ImageConvertOptions = {}
  ): Promise<UploadResult> {
    // Validate mimetype
    if (!this.validateImageMimetype(file.mimetype)) {
      throw new CustomHttpException(
        ErrorName.InvalidMimetype,
      );
    }
    // Generate unique filename with converted extension
    const outputFormat = options.format || imageOutputFormat;
    const newFilename = `${uuid()}.${outputFormat}`;
    const tempPath = path.join(uploadDir, `temp_${newFilename}`);

    try {
      // Write original file temporarily - handle both memory and disk storage
      if (file.buffer) {
        // Memory storage: data is in buffer
        await fs.promises.writeFile(tempPath, file.buffer);
      } else if (file.path) {
        // Disk storage: copy file from path
        await fs.promises.copyFile(file.path, tempPath);
      } else {
        throw new BadRequestException('No file data available');
      }

      // Convert to web standard format
      await this.convertImage(tempPath, newFilename, options);

      // Get output file stats
      const outputPath = path.join(uploadDir, newFilename);
      const stats = await fs.promises.stat(outputPath);

      // Clean up temp file
      await fs.promises.unlink(tempPath).catch(() => {});

      const result: UploadResult = {
        id: uuid(),
        name: `${getFilesRoute}${newFilename}`,
        mimetype: `image/${outputFormat}`,
        originalname: file.originalname,
        size: stats.size,
        converted: true,
      };

      // Save to database
      await this.imageFilesRepository.insert([result]);

      return result;
    } catch (error) {
      // Clean up on error
      try {
        await fs.promises.unlink(tempPath).catch(() => {});
      } catch {}
      
      if (error instanceof UnsupportedMediaTypeException) {
        throw error;
      }
      throw new BadRequestException(`Failed to process image: ${error.message}`);
    }
  }

  /**
   * Upload image or video without conversion
   * Preserves original format
   * Endpoint: POST /files/upload/media
   * Images: .jpg, .jpeg, .png, .gif, .webp, .heic, .heif, .avif
   * Videos: .webm, .mp4, .m4v, .mov
   */
  async uploadMedia(file: Express.Multer.File): Promise<UploadResult> {
    const ext = getFileExtension(file.originalname);
    const isImage = allowedImageExtensions.includes(ext);
    const isVideo = allowedVideoExtensions.includes(ext);

    if (!isImage && !isVideo) {
      throw new UnsupportedMediaTypeException(
        `Invalid file type. Allowed images: ${allowedImageExtensions.join(', ')}. Allowed videos: ${allowedVideoExtensions.join(', ')}`
      );
    }

    // Validate mimetype matches extension
    if (isImage && !this.validateImageMimetype(file.mimetype)) {
      throw new UnsupportedMediaTypeException(
        `Invalid image mimetype. Allowed: ${allowedImageTypes.join(', ')}`
      );
    }

    if (isVideo && !this.validateVideoMimetype(file.mimetype)) {
      throw new UnsupportedMediaTypeException(
        `Invalid video mimetype. Allowed: ${allowedVideoTypes.join(', ')}`
      );
    }

    // Generate unique filename preserving original extension
    const newFilename = `${uuid()}${ext}`;
    const outputPath = path.join(uploadDir, newFilename);

    try {
      // Write file to disk
      await fs.promises.writeFile(outputPath, file.buffer);

      const result: UploadResult = {
        id: uuid(),
        name: `${getFilesRoute}${newFilename}`,
        mimetype: file.mimetype,
        originalname: file.originalname,
        size: file.size,
        converted: false,
      };

      // Save to database
      await this.imageFilesRepository.insert([result]);

      return result;
    } catch (error) {
      try {
        await fs.promises.unlink(outputPath).catch(() => {});
      } catch {}
      
      throw new BadRequestException(`Failed to upload media: ${error.message}`);
    }
  }

  /**
   * Upload multiple images with conversion
   * Endpoint: POST /files/upload/images
   */
  async uploadMultipleImages(
    files: Express.Multer.File[],
    options: ImageConvertOptions = {}
  ): Promise<UploadResult[]> {
    if (!files || files.length === 0) {
      return [];
    }

    const results = await Promise.all(
      files.map(file => this.uploadAndConvertImage(file, options))
    );

    return results;
  }

  /**
   * Upload multiple media files (images and videos)
   * Endpoint: POST /files/upload/medias
   */
  async uploadMultipleMedia(
    files: Express.Multer.File[]
  ): Promise<UploadResult[]> {
    if (!files || files.length === 0) {
      return [];
    }

    const results = await Promise.all(
      files.map(file => this.uploadMedia(file))
    );

    return results;
  }

  /**
   * Validate if mimetype is allowed for images
   */
  private validateImageMimetype(mimetype: string): boolean {
    return allowedImageTypes.includes(mimetype);
  }

  /**
   * Validate if mimetype is allowed for videos
   */
  private validateVideoMimetype(mimetype: string): boolean {
    return allowedVideoTypes.includes(mimetype);
  }

  /**
   * Convert image to web standard format (webp)
   * Images: .jpg, .jpeg, .png, .gif, .webp, .heic, .heif, .avif -> .webp
   */
  private async convertImage(
    inputPath: string, 
    outputFilename: string,
    options: ImageConvertOptions = {}
  ): Promise<string> {
    const format = options.format || imageOutputFormat;
    const quality = options.quality || imageOutputQuality;
    const maxDim = options.maxDimension || imageMaxDimension;

    let pipeline = sharp(inputPath);
    
    // Get metadata to check dimensions
    const metadata = await pipeline.metadata();
    
    // Resize if larger than max dimension (maintain aspect ratio)
    if (metadata.width && metadata.height) {
      if (metadata.width > maxDim || metadata.height > maxDim) {
        pipeline = pipeline.resize(maxDim, maxDim, {
          fit: 'inside',
          withoutEnlargement: true,
        });
      }
    }

    // Convert to target format
    switch (format) {
      case 'webp':
        pipeline = pipeline.webp({ quality });
        break;
      case 'jpeg':
      case 'jpg':
        pipeline = pipeline.jpeg({ quality, mozjpeg: true });
        break;
      case 'png':
        pipeline = pipeline.png({ quality, compressionLevel: 9 });
        break;
      case 'avif':
        pipeline = pipeline.avif({ quality });
        break;
      default:
        pipeline = pipeline.webp({ quality });
    }

    const outputPath = path.join(uploadDir, outputFilename);
    await pipeline.toFile(outputPath);
    
    return outputPath;
  }


  async createImage(imageFileName, imageOutputFileName, size) {
    return await sharp(imageFileName)
      .resize(size, size)
      .toFile(imageOutputFileName);
  }

  async delete(filename: string) {
    return this.imageFilesRepository
      .delete({ name: filename })
      .then(async (data) => {
        try {
          const fs = require('fs');
          console.log(`deleting ${uploadDir}${filename}`);
          return await fs.unlinkSync(
            `${uploadDir}${filename}`.replace(getFilesRoute, ''),
          );
        } catch (err) {
          console.log('could not delete ' + filename);
          console.log(err);
        }
      });
  }

  async deleteMany(filenames: string[]) {
    if (filenames.length > 0) {
      return filenames.map((filename) => this.delete(filename));
    }
  }
}

