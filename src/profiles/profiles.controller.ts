import { Controller, Get, Post, Body, UseGuards, Put, Param } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from "@/auth/guards/auth.guard";
import { User } from "@/utils/decorators/user-extract-auth.decorator";
import { UserFromToken } from "@/auth/dto/token-payload.dto";

@UseGuards(AuthGuard)
@Controller()
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) { }

  @Post()
  create(@Body() createProfile: CreateProfileDto, @User() user: UserFromToken) {
    return this.profilesService.create(+user.sub, createProfile);
  }

  @Get(":id")
  findOne(@Param("id") userId: number, @User() user: UserFromToken) {
    return this.profilesService.findOne(+userId, +user.sub);
  }

  @Put(":id")
  update(
    @Param("id") userId: number,
    @Body() updateProfile: UpdateProfileDto,
    @User() user: UserFromToken
  ) {
    return this.profilesService.update(+userId, +user.sub, updateProfile);
  }
}
