import { authenticate } from '@loopback/authentication';
import { inject } from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {
  post,
  param,
  get,
  requestBody,
  RestBindings,
  Request,
  Response,
  oas,
  HttpErrors
} from '@loopback/rest';
import path from 'path';
import { FILE_UPLOAD_SERVICE, STORAGE_DIRECTORY } from '../keys';
import {FileRepository} from '../repositories';
import { getFilesAndFields } from '../services/file-upload.service';
import { FileUploadHandler } from '../types';

@authenticate('jwt')
export class FilesController {
  constructor(
    @inject(FILE_UPLOAD_SERVICE) private fileUploadHandler: FileUploadHandler,
    @inject(STORAGE_DIRECTORY) private storageDirectory: string,
    @repository(FileRepository)
    public fileRepository : FileRepository,
  ) {}

  @get('/files/{filename}')
  @oas.response.file()
  downloadFile(
    @param.path.string('filename') fileName: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    const file = this.validateFileName(fileName);
    response.download(file, fileName);
    return response;
  }

  /**
   * Validate file names to prevent them goes beyond the designated directory
   * @param fileName - File name
   */
  private validateFileName(fileName: string) {
    const resolved = path.resolve(this.storageDirectory, fileName);
    if (resolved.startsWith(this.storageDirectory)) return resolved;
    // The resolved file is outside sandbox
    throw new HttpErrors.BadRequest(`Invalid file name: ${fileName}`);
  }
  
  @authenticate('jwt')
  @post('/files/upload', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Files and fields',
      },
    },
  })
  async fileUpload(
    @requestBody.file() request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      this.fileUploadHandler(request, response, (err: unknown) => {
        if (err) reject(err);
        else {
          const uploadedFileRaw = getFilesAndFields(request)[0];
          const uploadedFile: object = { 
                "filename": uploadedFileRaw.filename,
                "originalName": uploadedFileRaw.originalname,
                "encoding": uploadedFileRaw.encoding,
                "mimetype": uploadedFileRaw.mimetype,
                "size": uploadedFileRaw.size,
                "url": '/files/' + uploadedFileRaw.filename,
              };
          this.fileRepository.create(uploadedFile).then(() => {
            return resolve(uploadedFile);
          }).catch((error) => console.log(error));
        }
      });
    });
  }
}
