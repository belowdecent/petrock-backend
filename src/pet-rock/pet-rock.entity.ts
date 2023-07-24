import { UserEntity } from "../user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PetRockEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ })
  name: string;

  @Column({ })
  color: string;

  @ManyToOne(() => UserEntity, (user) => user.rocks, {
    cascade: true
  })
  user: UserEntity
}
