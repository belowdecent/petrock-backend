import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return await this.userService.findAll();
  }

  @Post()
  async createUser(@Body('email') email: string, @Body('password') password: string) {
    console.log('good');
    return await this.userService.create(email, password);
  }
}
