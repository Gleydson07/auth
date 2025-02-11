import { Injectable } from '@nestjs/common';
import { ResponseLoginCredentialsDto } from '../modules/black-list/dto/response-credentials.dto';
import { ResponseBlackListDto } from '../modules/black-list/dto/response-black-list.dto';
import { SignInAuthDto } from '../modules/auth/dto/sign-in.dto';
import { UserFromToken } from '../modules/auth/dto/token-payload.dto';
import { UpdatePasswordDto } from '../modules/auth/dto/update-password.dto';
import { RecoveryPasswordDto } from '../modules/auth/dto/recovery-password.dto';

@Injectable()
export abstract class AuthRepository {
  abstract signIn({
    email,
    password,
  }: SignInAuthDto): Promise<ResponseLoginCredentialsDto>;

  abstract refresh(refreshToken: string): Promise<ResponseLoginCredentialsDto>;

  abstract revokeToken(
    token: string,
    args: string,
    user: UserFromToken,
  ): Promise<ResponseBlackListDto>;

  abstract signOut(
    token: string,
    user: UserFromToken,
  ): Promise<ResponseBlackListDto>;

  abstract updatePassword(
    data: UpdatePasswordDto,
    email: string,
  ): Promise<void>;

  abstract sendEmailToRecoveryPassword(email: string): Promise<void>;

  abstract recoveryPassword(data: RecoveryPasswordDto): Promise<void>;
}
