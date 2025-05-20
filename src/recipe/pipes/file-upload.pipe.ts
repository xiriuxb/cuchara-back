import {
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';

export const FileUploadPipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
    new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
  ],
  fileIsRequired: false,
});
