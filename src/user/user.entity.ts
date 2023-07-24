import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  passHash: string;

  @Column({ nullable: true})
  firstName: string;

  @Column({ nullable: true })
  lastName: string;
}
