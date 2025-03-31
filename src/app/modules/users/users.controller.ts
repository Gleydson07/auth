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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@/utils/decorators/user-extract-auth.decorator';
import { UserFromToken } from '@/app/modules/auth/dto/token-payload.dto';
import { RoleEnum } from '@prisma/client';
import { OnlyAdminGuard } from '@/infra/auth/guards/only-admin.guard';
import { parseBooleanOrUndefined } from '@/utils/functions/parseBoolean';
import { ChangeUserActiveStatusUseCase } from './usecases/change-user-active-status.usecase';
import { ChangeUserRoleUseCase } from './usecases/change-user-role.usecase';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { DeleteUserUseCase } from './usecases/delete-user.usecase';
import { FindAllUsersUseCase } from './usecases/find-all-users.usecase';
import { FindUserByIdUseCase } from './usecases/find-by-id-user.usecase';
import { UpdateUserUseCase } from './usecases/update-user.usecase';

@Controller('')
export class UsersController {
  constructor(
    private readonly changeUserActiveStatusUseCase: ChangeUserActiveStatusUseCase,
    private readonly changeUserRoleUseCase: ChangeUserRoleUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  @UseGuards(OnlyAdminGuard)
  @Post()
  create(@Body() createUser: CreateUserDto) {
    return this.createUserUseCase.execute(createUser);
  }

  @UseGuards(OnlyAdminGuard)
  @HttpCode(200)
  @Post('/:userId/roles/:role')
  role(
    @Param('role') role: RoleEnum,
    @Param('userId') userId: number,
    @User() user: UserFromToken,
  ) {
    return this.changeUserRoleUseCase.execute(user, role, +userId);
  }

  @UseGuards(OnlyAdminGuard)
  @HttpCode(200)
  @Post('/:userId/active/:active')
  active(
    @Param('userId') userId: number,
    @Param('active') active: string,
    @User() user: UserFromToken,
  ) {
    return this.changeUserActiveStatusUseCase.execute(
      user,
      active === 'true' ? true : false,
      +userId,
    );
  }

  @Get()
  findAll(@Query('active') active?: string) {
    const isActive = parseBooleanOrUndefined(active);
    return this.findAllUsersUseCase.execute(isActive);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('active') active: string) {
    const isActive = parseBooleanOrUndefined(active);
    return this.findUserByIdUseCase.execute(+id, isActive);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: UserFromToken,
  ) {
    return this.updateUserUseCase.execute(user, +id, updateUserDto);
  }

  @UseGuards(OnlyAdminGuard)
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteUserUseCase.execute(+id);
  }
}
