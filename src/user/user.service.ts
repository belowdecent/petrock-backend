import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { EditUserDto } from '../dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepo: Repository<UserEntity>,
  ) {}

  async getUser(userId: number) {
    return await this.usersRepo.findOneBy({
      id: userId,
    });
  }

  async editUser(userId: number, dto: EditUserDto) {
    await this.usersRepo.update(
      {
        id: userId,
      },
      {
        ...dto,
      },
    );

    return await this.usersRepo.findOneBy({
      id: userId,
    });
  }
}
