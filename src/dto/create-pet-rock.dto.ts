import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePetRockDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  color: string;
}
