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
import { AuthService } from './auth.service';
import { SignInAuthDto } from './dto/sign-in.dto';
import { User } from '@/utils/decorators/user-extract-auth.decorator';
import { UserFromToken } from './dto/token-payload.dto';
import { Token } from '@/utils/decorators/token-extract-auth.decorator';
import { OnlyAdminGuard } from './guards/only-admin.guard';
import { RecoveryPasswordDto } from './dto/recovery-password.dto copy';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { IsPublic } from '@/utils/decorators/is-public.decorator';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @HttpCode(200)
  @Post('sign-in')
  signIn(@Body() SignInAuth: SignInAuthDto) {
    return this.authService.signIn(SignInAuth);
  }

  @IsPublic()
  @HttpCode(200)
  @Post('refresh')
  refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @IsPublic()
  @HttpCode(204)
  @Post('/recovery-password/:email/email')
  requerstRecoveryPassword(@Param('email') emailRecipient: string) {
    return this.authService.sendEmailToRecoveryPassword(emailRecipient);
  }

  @IsPublic()
  @HttpCode(204)
  @Post('/recovery-password')
  RecoveryPassword(@Body() data: RecoveryPasswordDto) {
    return this.authService.recoveryPassword(data);
  }

  @HttpCode(204)
  @Put('/password')
  ChangePassword(@Body() data: UpdatePasswordDto, @User() user: UserFromToken) {
    return this.authService.updatePassword(data, user.email);
  }

  @UseGuards(OnlyAdminGuard)
  @Delete('revoke')
  revokeToken(
    @Body('token') token: string,
    @Body('args') args: string,
    @User() user: UserFromToken,
  ) {
    return this.authService.revokeToken(token, args, user);
  }

  @HttpCode(204)
  @Post('sign-out')
  signOut(@Token() token: string, @User() user: UserFromToken) {
    this.authService.signOut(token, user);
  }
}
