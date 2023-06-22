import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne } from 'typeorm';

@Entity()
export class Form {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, user => user.form)
  user: User;

  @Column()
  userID: number;

  @Column()
  userName: string;

  @Column()
  age: number;

  @Column()
  city: string;

  @Column()
  gender: string;

  @Column()
  musicalInstrument: string;

  @Column()
  description: string;

  @Column()
  communication: string;
}