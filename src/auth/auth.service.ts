import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from '../dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ConfigService } from '@nestjs/config';

import * as argon from 'argon2';
import { on } from 'events';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepo: Repository<UserEntity>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async login(dto: AuthDto) {
    const user = await this.usersRepo.findOneBy({
      email: dto.email,
    });

    if (!user) throw new ForbiddenException('No such user');

    const passMatches = await argon.verify(user.passHash, dto.password);
    if (!passMatches) throw new ForbiddenException('Wrong password');

    return this.signToken(user.id, user.email);
  }

  async signup(dto: AuthDto) {
    const existingUser = await this.usersRepo.findOneBy({
      email: dto.email,
    });

    if (existingUser) throw new ForbiddenException('User already exists');

    const passHash = await argon.hash(dto.password);

    const user = this.usersRepo.create({
      email: dto.email,
      passHash,
    });

    const generatedUser = await this.usersRepo.save(user);

    return this.signToken(generatedUser.id, generatedUser.email);
  }

  async signToken(userId: number, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });

    return {
      access_token: token,
    };
  }
}
