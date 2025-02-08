import { IsIn, IsNotEmpty, IsNumber, IsString, Max } from 'class-validator';

export class UploadedFileDto {
  @IsNotEmpty()
  @IsString()
  originalname: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['jpg', 'jpeg', 'png'], { message: 'Apenas arquivos JPG, JPEG ou PNG são permitidos.' })
  extension: string;

  @IsNotEmpty()
  @IsNumber()
  @Max(10485760, { each: true, message: "O arquivo não pode ser maior que 10MB" })
  size: number;
}