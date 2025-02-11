import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from '../modules/profiles/dto/create-profile.dto';
import { UpdateProfileDto } from '../modules/profiles/dto/update-profile.dto';
import { ResponseProfileDto } from '../modules/profiles/dto/response-profile.dto';

@Injectable()
export abstract class ProfileRepository {
  abstract create(
    userId: number,
    createProfile: CreateProfileDto,
  ): Promise<ResponseProfileDto>;

  abstract findOne(userId: number): Promise<ResponseProfileDto>;

  abstract update(
    userId: number,
    updateProfile: UpdateProfileDto,
  ): Promise<ResponseProfileDto>;

  abstract remove(userId: number): Promise<void>;
}
