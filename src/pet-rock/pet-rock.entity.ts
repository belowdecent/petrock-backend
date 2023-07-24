import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PetRockEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  name: string;

  @Column({})
  color: string;

  @Column({})
  userId: number;
}
