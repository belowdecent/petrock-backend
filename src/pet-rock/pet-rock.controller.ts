import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { PetRockService } from './pet-rock.service';
import { GetUser } from '../get-user/get-user.decorator';
import { UserEntity } from '../user/user.entity';
import { CreatePetRockDto, EditPetRockDto } from '../dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('pets')
export class PetRockController {
  constructor(private petRockService: PetRockService) {}

  @Get()
  async getPets(@GetUser('id') userId: number) {
    console.log(userId);
    return await this.petRockService.getPetRocks(userId);
  }

  @Get(':id')
  getPetById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) petRockId: number,
  ) {
    return this.petRockService.getPetRockById(userId, petRockId);
  }

  @Post()
  createPet(
    @GetUser('id') userId: number,
    @Body() dto: CreatePetRockDto,
  ) {
    return this.petRockService.createPetRock(userId, dto);
  }

  @Patch(':id')
  editPet(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) petRockId: number,
    @Body() dto: EditPetRockDto,
  ) {
    return this.petRockService.editPetRockById(userId, petRockId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deletePet(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) petRockId: number,
  ) {
    return this.petRockService.deletePetRockById(userId, petRockId);
  }
}
