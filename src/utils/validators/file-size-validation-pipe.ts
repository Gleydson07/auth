import { UploadedFileDto } from '@/app/modules/profiles/dto/upload-file-profile.dto';
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  ParseFilePipe,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const parseFilePipe = new ParseFilePipe();
    const parsedFile = await parseFilePipe.transform(value);

    const extension = parsedFile.originalname.split('.').pop();

    const uploadedFileDto = new UploadedFileDto();
    uploadedFileDto.originalname = parsedFile.originalname;
    uploadedFileDto.extension = extension;
    uploadedFileDto.size = value.size;

    const errors = await validate(uploadedFileDto);

    if (errors.length > 0) {
      const formattedErrors = errors.map(
        (err) =>
          err.constraints.matches || err.constraints.max || err.constraints,
      );

      throw new BadRequestException(formattedErrors);
    }

    return parsedFile;
  }
}
