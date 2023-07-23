import { Column, PrimaryGeneratedColumn } from "typeorm";

export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
