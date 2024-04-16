import { Controller, Get, Post, Body, UseGuards, Put } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from "@/auth/guards/auth.guard";
import { User } from "@/utils/decorators/user-extract-auth.decorator";
import { UserFromToken } from "@/auth/dto/token-payload.dto";

@UseGuards(AuthGuard)
@Controller('')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) { }

  @Post()
  create(@Body() createProfileDto: CreateProfileDto, @User() user: UserFromToken) {
    return this.profilesService.create(user.sub, createProfileDto);
  }

  @Get()
  findOne(@User() user: UserFromToken) {
    return this.profilesService.findOne(+user.sub);
  }

  @Put()
  update(
    @Body() updateProfileDto: UpdateProfileDto,
    @User() user: UserFromToken
  ) {
    return this.profilesService.update(user.sub, updateProfileDto);
  }
}
