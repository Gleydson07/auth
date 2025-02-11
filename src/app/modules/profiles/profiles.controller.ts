import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from '@/utils/decorators/user-extract-auth.decorator';
import { UserFromToken } from '@/app/modules/auth/dto/token-payload.dto';
import { CreateProfileUseCase } from './usecases/create-profile.usecase';
import { FindByUserIdProfileUseCase } from './usecases/find-by-user-id-profile.usecase';
import { RemoveProfileUseCase } from './usecases/remove-profile.usecase';
import { UpdateProfileUseCase } from './usecases/update-profile.usecase';

@Controller()
export class ProfilesController {
  constructor(
    private readonly createProfileUseCase: CreateProfileUseCase,
    private readonly findByUserIdProfileUseCase: FindByUserIdProfileUseCase,
    private readonly removeProfileUseCase: RemoveProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
  ) {}

  @Post()
  create(
    @Param('id') userId: number,
    @Body() createProfile: CreateProfileDto,
    @User() user: UserFromToken,
  ) {
    return this.createProfileUseCase.execute(+userId, +user.sub, createProfile);
  }

  @Get()
  findOne(@Param('id') userId: number) {
    return this.findByUserIdProfileUseCase.execute(+userId);
  }

  @Put()
  update(
    @Param('id') userId: number,
    @Body() updateProfile: UpdateProfileDto,
    @User() user: UserFromToken,
  ) {
    return this.updateProfileUseCase.execute(+userId, +user.sub, updateProfile);
  }

  @HttpCode(204)
  @Delete()
  delete(@Param('id') userId: number, @User() user: UserFromToken) {
    return this.removeProfileUseCase.execute(+userId, +user.sub);
  }
}
