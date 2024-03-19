import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from "@/database/Prisma/prisma.service";

@Injectable()
export class ProfilesService {
  constructor(private readonly prismaService: PrismaService) { }

  create(userId: number, createProfile: CreateProfileDto) {
    return this.prismaService.profile.create({
      data: {
        userId: userId,
        birthDay: new Date(createProfile.birthDay),
        gender: createProfile.gender,
        mainRegistration: createProfile.mainRegistration,
      }
    });
  }

  uploadAvatar() {

  }

  findOne(userId: number) {
    return this.prismaService.profile.findUnique({
      where: { userId: userId }
    });
  }

  update(userId: number, updateProfile: UpdateProfileDto) {
    return this.prismaService.profile.update({
      where: {
        userId: userId
      },
      data: {
        birthDay: new Date(updateProfile.birthDay),
        gender: updateProfile.gender,
        mainRegistration: updateProfile.mainRegistration,
      }
    });
  }
}
