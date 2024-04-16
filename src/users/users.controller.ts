import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from "@/auth/guards/auth.guard";
import { User } from "@/utils/decorators/user-extract-auth.decorator";
import { UserFromToken } from "@/auth/dto/token-payload.dto";
import { CreateRoleDto } from "./dto/create-role.dto";

@UseGuards(AuthGuard)
@Controller('')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post("roles")
  createRole(
    @Body() data: CreateRoleDto,
    @User() user: UserFromToken
  ) {
    return this.usersService.changeRole(user, data);
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
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @HttpCode(204)
  @Delete('/default')
  removeDefaultProfile() {
    return this.usersService.removeDefault();
  }
}
