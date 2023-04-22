import { IsNotEmpty } from 'class-validator';
import { Application } from 'src/application/application.entity';
import { Band } from 'src/band/band.entity';
import { Form } from 'src/form/form.entity';
import { Member } from 'src/member/member.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;


    @Column({ unique: true })
    @IsNotEmpty()
    login: string;

    @Column()
    password: string;

    @OneToOne(() => Form, form => form.user)
    form: Form;

    @OneToOne(() => Band, band => band.user)
    band: Band;

    @OneToMany(() => Member, member => member.user)
    member: Member[];

    @OneToMany(() => Application, application => application.user)
    applications: Application[];
}
