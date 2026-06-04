import { FilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter, videoImageFilter } from '../../modules/storage/storage.utils';

/**
 * Creates disk storage options for multer
 */
function createStorageOptions(
  fileFilter?: (req: any, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => void
) {
  const options: any = {
    storage: diskStorage({
      destination: process.env.UPLOADS_PATH,
      filename: editFileName,
    }),
  };
  
  if (fileFilter) {
    options.fileFilter = fileFilter;
  }
  
  return options;
}

/**
 * FilesInterceptor for multiple files with same field name
 * @example
 * @UseInterceptors(FileUploadInterceptor('images[]', 10, imageFileFilter))
 */
export const FileUploadInterceptor = (
  fieldName: string = 'files',
  maxCount: number = 10,
  filter: (req: any, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => void = imageFileFilter,
) => FilesInterceptor(fieldName, maxCount, createStorageOptions(filter));

/**
 * FileFieldsInterceptor for multiple files with different field names
 * @example
 * @UseInterceptors(FileFieldsUploadInterceptor([{ name: 'logo', maxCount: 1 }], videoImageFilter))
 */
export const FileFieldsUploadInterceptor = (
  fields: Array<{ name: string; maxCount: number }>,
  filter: (req: any, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => void = imageFileFilter,
) => FileFieldsInterceptor(fields as any, createStorageOptions(filter));

// Re-export common filters
export { imageFileFilter, videoImageFilter };
