import {
  Controller,
  Post,
  Body,
  HttpCode,
  Delete,
  UseGuards,
  Param,
  Put,
} from '@nestjs/common';
import { SignInAuthDto } from './dto/sign-in.dto';
import { User } from '@/utils/decorators/user-extract-auth.decorator';
import { UserFromToken } from './dto/token-payload.dto';
import { Token } from '@/utils/decorators/token-extract-auth.decorator';
import { OnlyAdminGuard } from './guards/only-admin.guard';
import { RecoveryPasswordDto } from './dto/recovery-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { IsPublic } from '@/utils/decorators/is-public.decorator';
import { RecoveryPasswordUseCase } from './usecases/recovery-password.usecase';
import { RefreshTokenUseCase } from './usecases/refresh-token.usecase';
import { SendMailToRecoveryPasswordUseCase } from './usecases/send-mail-to-recovery-password.usecase';
import { RevokeTokenUseCase } from './usecases/revoke-token.usecase';
import { SignInUseCase } from './usecases/sign-in.usecase';
import { UpdatePasswordUseCase } from './usecases/update-password.usecase';

@Controller('')
export class AuthController {
  constructor(
    private readonly recoveryPasswordUseCase: RecoveryPasswordUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly revokeTokenUseCase: RevokeTokenUseCase,
    private readonly sendMailToRecoveryPasswordUseCase: SendMailToRecoveryPasswordUseCase,
    private readonly signInUseCase: SignInUseCase,
    private readonly updatePasswordUseCase: UpdatePasswordUseCase,
  ) {}

  @IsPublic()
  @HttpCode(200)
  @Post('sign-in')
  signIn(@Body() SignInAuth: SignInAuthDto) {
    return this.signInUseCase.execute(SignInAuth);
  }

  @IsPublic()
  @HttpCode(200)
  @Post('refresh')
  refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.refreshTokenUseCase.execute(refreshToken);
  }

  @IsPublic()
  @HttpCode(204)
  @Post('/recovery-password/:email/email')
  requerstRecoveryPassword(@Param('email') emailRecipient: string) {
    return this.sendMailToRecoveryPasswordUseCase.execute(emailRecipient);
  }

  @IsPublic()
  @HttpCode(204)
  @Post('/recovery-password')
  RecoveryPassword(@Body() data: RecoveryPasswordDto) {
    return this.recoveryPasswordUseCase.execute(data);
  }

  @HttpCode(204)
  @Put('/password')
  ChangePassword(@Body() data: UpdatePasswordDto, @User() user: UserFromToken) {
    return this.updatePasswordUseCase.execute(data, user.email);
  }

  @UseGuards(OnlyAdminGuard)
  @Delete('revoke')
  revokeToken(
    @Body('token') token: string,
    @Body('args') args: string,
    @User() user: UserFromToken,
  ) {
    return this.revokeTokenUseCase.execute(token, args, user);
  }

  @HttpCode(204)
  @Post('sign-out')
  signOut(@Token() token: string, @User() user: UserFromToken) {
    this.revokeTokenUseCase.execute(token, 'sign-out', user);
  }
}
