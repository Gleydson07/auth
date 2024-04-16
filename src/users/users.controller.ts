import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from "@/auth/guards/auth.guard";
import { User } from "@/utils/decorators/user-extract-auth.decorator";
import { UserFromToken } from "@/auth/dto/token-payload.dto";
import { RoleEnum } from "@prisma/client";
import { OnlyAdminGuard } from "@/auth/guards/only-admin.guard";
import { Token } from "@/utils/decorators/token-extract-auth.decorator";

@UseGuards(AuthGuard)
@Controller('')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(OnlyAdminGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(OnlyAdminGuard)
  @Post("/:userId/roles/:role")
  role(
    @Param("role") role: RoleEnum,
    @Param("userId") userId: number,
    @User() user: UserFromToken
  ) {
    return this.usersService.changeRole(user, role, +userId);
  }

  @UseGuards(OnlyAdminGuard)
  @Post("/:userId/enable")
  active(
    @Param("userId") userId: number,
    @User() user: UserFromToken
  ) {
    return this.usersService.changeActive(user, +userId);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: UserFromToken
  ) {
    return this.usersService.update(user, +id, updateUserDto);
  }

  @UseGuards(OnlyAdminGuard)
  @HttpCode(204)
  @Put('/admin/default')
  updateDefaultProfile(@Body() data: {active: boolean, role: RoleEnum}) {
    return this.usersService.updateUserAdmin(data);
  }

  @UseGuards(OnlyAdminGuard)
  @HttpCode(204)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @User() user: UserFromToken,
    @Token() token: string,
  ) {
    return this.usersService.remove(user, token, +id);
  }
}
