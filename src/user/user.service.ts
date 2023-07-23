import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async findAll() {
    return this.usersRepository.find();
  }

  async remove(id: number) {
    await this.usersRepository.delete(id);
  }

  async create(email: string, password: string) {
    const passHash = await argon.hash(password);

    const newUser = this.usersRepository.create({
      email: email,
      passHash: passHash,
    });

    await this.usersRepository.save(newUser);
    return newUser;
  }
}
