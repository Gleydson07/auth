import { PartialType } from '@nestjs/mapped-types';
import { CreateProvisionalPasswordDto } from './create-provisional-password.dto';

export class UpdateProvisionalPasswordDto extends PartialType(
  CreateProvisionalPasswordDto,
) {}
