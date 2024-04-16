import { Controller, Post, Body, HttpCode, Delete, UseGuards, Req, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInAuthDto } from './dto/sign-in.dto';
import { User } from "@/utils/decorators/user-extract-auth.decorator";
import { UserFromToken } from "./dto/token-payload.dto";
import { AuthGuard } from "./guards/auth.guard";
import { Token } from "@/utils/decorators/token-extract-auth.decorator";
import { OnlyAdminGuard } from "./guards/only-admin.guard";

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(200)
  @Post('sign-in')
  signIn(@Body() SignInAuth: SignInAuthDto) {
    return this.authService.signIn(SignInAuth);
  }

  @HttpCode(200)
  @Post('refresh')
  refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @UseGuards(AuthGuard, OnlyAdminGuard)
  @Delete('revoke')
  revokeToken(
    @Body('token') token: string,
    @Body('args') args: string,
    @User() user: UserFromToken
  ) {
    return this.authService.revokeToken(token, args, user);
  }

  @HttpCode(204)
  @UseGuards(AuthGuard)
  @Post('sign-out')
  signOut(@Token() token: string, @User() user: UserFromToken) {
    const args = "sign-out";
    this.authService.signOut(token, args, user);
  }
}
