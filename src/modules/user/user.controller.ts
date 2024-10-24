import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './interface/user.interface';
import { UserService } from './user.service';
import { UserRoles } from './interface/user-role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { RoleGroups } from 'src/guards/role-groups';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(...RoleGroups.ALL_ADMIN)
  @UseGuards(RolesGuard)
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @Roles(...RoleGroups.ORG_GROUP)
  @UseGuards(RolesGuard)
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Post()
  @Roles(...RoleGroups.ADMIN_GROUP)
  @UseGuards(RolesGuard)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  @Roles(...RoleGroups.ADMIN_GROUP)
  @UseGuards(RolesGuard)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(...RoleGroups.ADMIN_GROUP)
  @UseGuards(RolesGuard)
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.userService.deleteUser(id);
  }

  @Get('role/:role')
  @Roles(...RoleGroups.ORG_GROUP)
  @UseGuards(RolesGuard)
  async getUsersByRole(@Param('role') role: UserRoles): Promise<User[]> {
    return this.userService.getUsersByRole(role);
  }
}
