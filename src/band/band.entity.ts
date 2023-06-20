import { Application } from 'src/application/application.entity';
import { Member } from 'src/member/member.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class Band {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.band)
    user: User;

    @Column()
    userID: number;

    @Column()
    bandName: string;

    @Column()
    description: string;

    @Column()
    creatorId: number;

    @Column()
    contact: string;

    @OneToMany(() => Member, member => member.band)
    members: Member[];

    @OneToMany(() => Application, application => application.band)
    applications: Application[];
}