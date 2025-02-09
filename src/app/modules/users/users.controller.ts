import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  HttpCode,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@/utils/decorators/user-extract-auth.decorator';
import { UserFromToken } from '@/app/modules/auth/dto/token-payload.dto';
import { RoleEnum } from '@prisma/client';
import { OnlyAdminGuard } from '@/app/modules/auth/guards/only-admin.guard';
import { parseBooleanOrUndefined } from '@/utils/functions/parseBoolean';

@Controller('')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(OnlyAdminGuard)
  @Post()
  create(@Body() createUser: CreateUserDto) {
    return this.usersService.create(createUser);
  }

  @UseGuards(OnlyAdminGuard)
  @HttpCode(200)
  @Post('/:userId/roles/:role')
  role(
    @Param('role') role: RoleEnum,
    @Param('userId') userId: number,
    @User() user: UserFromToken,
  ) {
    return this.usersService.changeRole(user, role, +userId);
  }

  @UseGuards(OnlyAdminGuard)
  @HttpCode(200)
  @Post('/:userId/active/:active')
  active(
    @Param('userId') userId: number,
    @Param('active') active: string,
    @User() user: UserFromToken,
  ) {
    return this.usersService.changeActive(
      user,
      active === 'true' ? true : false,
      +userId,
    );
  }

  @Get()
  findAll(@Query('active') active?: string) {
    const isActive = parseBooleanOrUndefined(active);
    return this.usersService.findAll(isActive);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('active') active: string) {
    const isActive = parseBooleanOrUndefined(active);
    return this.usersService.findOneById(+id, isActive);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: UserFromToken,
  ) {
    return this.usersService.update(user, +id, updateUserDto);
  }

  @UseGuards(OnlyAdminGuard)
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
