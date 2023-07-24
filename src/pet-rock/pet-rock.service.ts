import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PetRockEntity } from './pet-rock.entity';
import { UserEntity } from '../user/user.entity';
import { CreatePetRockDto, EditPetRockDto } from '../dto';

@Injectable()
export class PetRockService {
  constructor(
    @InjectRepository(PetRockEntity)
    private petRockRepo: Repository<PetRockEntity>,
  ) {}

  getPetRocks(user: UserEntity) {
    return user.rocks;
  }

  getPetRockById(user: UserEntity, petRockId: number) {
    return user.rocks.find((i) => i.id === petRockId);
  }

  async createPetRock(user: UserEntity, dto: CreatePetRockDto) {}
  async editPetRockById(
    user: UserEntity,
    petRockId: number,
    dto: EditPetRockDto,
  ) {}
  async deletePetRockById(user: UserEntity, petRockId: number) {}
}
