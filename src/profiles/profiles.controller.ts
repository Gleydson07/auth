import { Controller, Get, Post, Body, UseGuards, Put, UploadedFile, UseInterceptors, ParseFilePipe, Request, Req, HttpCode } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from "@/auth/guards/auth.guard";
import { User } from "@/utils/decorators/user-extract-auth.decorator";
import { UserFromToken } from "@/auth/dto/token-payload.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileSizeValidationPipe } from "@/utils/validators/file-size-validation-pipe";
import { FileDto } from "./dto/file.dto";

@UseGuards(AuthGuard)
@Controller('')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) { }

  @Post()
  create(@Body() createProfileDto: CreateProfileDto, @User() user: UserFromToken) {
    return this.profilesService.create(user.sub, createProfileDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @UploadedFile(FileSizeValidationPipe) file: FileDto,
    @User() user: UserFromToken,
  ) {
    console.log(1, file)
    // return this.profilesService.uploadAvatar(user.sub, file);
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
