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
  Request,
} from '@nestjs/common';
import { AdminGuard } from 'src/guards/admin.guards';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './interface/user.interface';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(req.user.id, id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.userService.deleteUser(req.user.id, id);
  }

  @Get('role/:role')
  @UseGuards(AdminGuard)
  async getUsersByRole(@Param('role') role: UserRole): Promise<User[]> {
    return this.userService.getUsersByRole(role);
  }

  @Get('admins')
  @UseGuards(AdminGuard)
  async getAdmins(): Promise<User[]> {
    return this.userService.getUsersByRole(UserRole.ADMIN);
  }
}
