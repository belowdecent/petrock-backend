import { ForbiddenException, Injectable, UseGuards } from '@nestjs/common';
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
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>
  ) {}

  async getPetRocks(userId: number) {
    return await this.petRockRepo.findBy({userId});
  }

  async getPetRockById(userId: number, petRockId: number) {
    const rock = await this.petRockRepo.findOneBy({
      id: petRockId
    });

    if (!rock || rock.userId != userId) throw new ForbiddenException("Not your rock");

    return rock;
  }

  async createPetRock(userId: number, dto: CreatePetRockDto) {
    const pet = this.petRockRepo.create({
      userId: userId,
      ...dto,
    });

    await this.petRockRepo.save(pet);
    return pet;
  }

  async editPetRockById(
    userId: number,
    petRockId: number,
    dto: EditPetRockDto,
  ) {
    const petrock = await this.petRockRepo.findOneBy({
      id: petRockId,
    });

    if (!petrock || petrock.userId != userId) throw new ForbiddenException('Not your petrock');

    await this.petRockRepo.update({
      id: petRockId,
    }, {
      ...dto
    });

    return this.petRockRepo.findOneBy({
      id: petRockId,
    });
  }

  async deletePetRockById(userId: number, petRockId: number) {
    const petrock = await this.petRockRepo.findOneBy({
      id: petRockId,
    });

    if (!petrock || petrock.userId != userId) throw new ForbiddenException('Not your petrock');

    await this.petRockRepo.delete({
      id: petRockId,
    });

    return petrock;
  }
}
