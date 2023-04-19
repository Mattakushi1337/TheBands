import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { hashPassword } from 'src/utils/hash-password.util';
import { compare } from 'bcryptjs';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(login: string, password: string) {
        try {
            const user = new User();
            user.login = login;
            user.password = await hashPassword(password);
            return await this.userRepository.save(user);
        } catch (error) {
            throw new HttpException('This login already used', HttpStatus.NOT_ACCEPTABLE)
        }
    }

    async findByLoginAndPassword(login: string, password: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { login } });
        if (!user) {
            throw new HttpException('Invalid login or password', HttpStatus.UNAUTHORIZED)
        }
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            throw new HttpException('Invalid login or password', HttpStatus.UNAUTHORIZED)
        }
        return user;
    }

    async findByLogin(login: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { login } });
        return user;
    }
    async findById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        return user;
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }
}