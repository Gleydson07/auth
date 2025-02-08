import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Put,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from '@/app/modules/auth/guards/auth.guard';
import { User } from '@/utils/decorators/user-extract-auth.decorator';
import { UserFromToken } from '@/app/modules/auth/dto/token-payload.dto';

@UseGuards(AuthGuard)
@Controller()
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  create(
    @Param('id') userId: number,
    @Body() createProfile: CreateProfileDto,
    @User() user: UserFromToken,
  ) {
    return this.profilesService.create(+userId, +user.sub, createProfile);
  }

  @Get()
  findOne(@Param('id') userId: number) {
    return this.profilesService.findOne(+userId);
  }

  @Put()
  update(
    @Param('id') userId: number,
    @Body() updateProfile: UpdateProfileDto,
    @User() user: UserFromToken,
  ) {
    return this.profilesService.update(+userId, +user.sub, updateProfile);
  }

  @HttpCode(204)
  @Delete()
  delete(@Param('id') userId: number, @User() user: UserFromToken) {
    return this.profilesService.remove(+userId, +user.sub);
  }
}
