import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { hashPassword } from 'src/utils/hash-password.util';

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

    async findByLoginAndPassword(login: string, password: string) {
        const user = await this.userRepository.findOne({ where: { login, password } });
        if (!user) {
            throw new HttpException('Invalid login or password', HttpStatus.UNAUTHORIZED)
        }
        return user;
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }
}