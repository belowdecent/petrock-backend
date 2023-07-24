import { IsOptional, IsString } from 'class-validator';

export class EditPetRockDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  color: string;
}
