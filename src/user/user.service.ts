import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import * as argon from 'argon2';
import { EditUserDto } from '../dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepo: Repository<UserEntity>,
  ) {}

  async editUser(userId: number, dto: EditUserDto) {
    await this.usersRepo.update({
      id: userId
    }, {
      ...dto
    });

    return await this.usersRepo.findOneBy({
      id: userId
    });
  }
}
