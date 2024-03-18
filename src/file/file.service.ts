import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  uploadFile(file: Express.Multer.File) {
    return file;
  }
}
