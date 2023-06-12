import { Band } from "src/band/band.entity";
import { User } from "src/user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role: string;

  @ManyToOne(() => User, user => user.member)
  user: User;

  @ManyToOne(() => Band, band => band.members)
  band: Band;
}