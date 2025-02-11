import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/Prisma/prisma.service';
import { ProfileRepository } from '@/app/repositories/profile.repository';
import {
  CreateProfileDto,
  DocumentTypeEnum,
  GenderEnum,
} from '@/app/modules/profiles/dto/create-profile.dto';
import { UpdateProfileDto } from '@/app/modules/profiles/dto/update-profile.dto';

@Injectable()
export class PrismaProfileRepository implements ProfileRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: number, createProfile: CreateProfileDto) {
    const profile = await this.prismaService.profile.create({
      data: {
        userId: userId,
        birthDay: createProfile.birthDay
          ? new Date(createProfile?.birthDay)
          : undefined,
        gender: createProfile?.gender,
        phone: createProfile?.phone,
        document: createProfile.document,
        documentType: createProfile.documentType,
      },
    });

    return {
      ...profile,
      gender: profile.gender as GenderEnum,
      documentType: profile.gender as DocumentTypeEnum,
    };
  }

  async findOne(userId: number) {
    const profile = await this.prismaService.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return null;
    }

    return {
      ...profile,
      gender: profile.gender as GenderEnum,
      documentType: profile.gender as DocumentTypeEnum,
    };
  }

  async update(userId: number, updateProfile: UpdateProfileDto) {
    const profile = await this.prismaService.profile.update({
      where: {
        userId: userId,
      },
      data: {
        birthDay: updateProfile.birthDay,
        gender: updateProfile?.gender,
        phone: updateProfile?.phone,
        document: updateProfile?.document,
        documentType: updateProfile?.documentType,
      },
    });

    return {
      ...profile,
      gender: profile.gender as GenderEnum,
      documentType: profile.gender as DocumentTypeEnum,
    };
  }

  async remove(userId: number) {
    await this.prismaService.profile.delete({
      where: {
        userId: userId,
      },
    });
  }
}
