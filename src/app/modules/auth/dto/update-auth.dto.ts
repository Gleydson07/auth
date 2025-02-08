import { PartialType } from '@nestjs/mapped-types';
import { SignInAuthDto } from './sign-in.dto';

export class UpdateAuthDto extends PartialType(SignInAuthDto) { }
