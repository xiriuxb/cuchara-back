import { ParseFilePipe, MaxFileSizeValidator } from '@nestjs/common';

export const FileUploadPipe = new ParseFilePipe({
  validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })],
  fileIsRequired: true,
});
