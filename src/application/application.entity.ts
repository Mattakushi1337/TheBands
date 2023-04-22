import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Band } from 'src/band/band.entity';

@Entity()
export class Application {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.applications)
    user: User;

    @ManyToOne(() => Band, band => band.applications)
    band: Band;

    @Column()
    status: string
}