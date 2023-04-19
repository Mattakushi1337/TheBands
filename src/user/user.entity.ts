import { IsNotEmpty } from 'class-validator';
import { Form } from 'src/form/form.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

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
}
