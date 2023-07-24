import { Module } from '@nestjs/common';
import { PetRockController } from './pet-rock.controller';
import { PetRockService } from './pet-rock.service';
import { PetRockEntity } from './pet-rock.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PetRockEntity])],
  controllers: [PetRockController],
  providers: [PetRockService],
})
export class PetRockModule {}
