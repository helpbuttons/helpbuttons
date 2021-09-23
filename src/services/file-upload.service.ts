import {
  BindingScope,
  config,
  ContextTags,
  injectable,
  Provider,
} from '@loopback/core';
import multer from 'multer';
import { FILE_UPLOAD_SERVICE } from '../keys';
import { FileUploaded, FileUploadHandler } from '../types';
import { Request } from '@loopback/rest'
/**
 * A provider to return an `Express` request handler from `multer` middleware
 */
@injectable({
  scope: BindingScope.TRANSIENT,
  tags: { [ContextTags.KEY]: FILE_UPLOAD_SERVICE },
})
export class FileUploadProvider implements Provider<FileUploadHandler> {
  constructor(@config() private options: multer.Options = {}) {
    if (!this.options.storage) {
      // Default to in-memory storage
      this.options.storage = multer.memoryStorage();
    }
  }

  value(): FileUploadHandler {
    return multer(this.options).any();
  }
}

export function getFilesAndFields(request: Request): FileUploaded[] {
  const uploadedFiles = request.files;
  const mapper = (f: globalThis.Express.Multer.File) => ({
    fieldname: f.fieldname,
    originalname: f.originalname,
    encoding: f.encoding,
    mimetype: f.mimetype,
    filename: f.filename,
    size: f.size,
  });
  let files: FileUploaded[] = [];
  if (Array.isArray(uploadedFiles)) {
    files = uploadedFiles.map(mapper);
  } else {
    for (const filename in uploadedFiles) {
      files.push(...uploadedFiles[filename].map(mapper));
    }
  }
  return files;
  // return { files, fields: request.body };
}