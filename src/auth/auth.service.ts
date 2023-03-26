import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async register(login: string, password: string) {
        const user = await this.userService.create(login, password);
        const payload = { sub: user.id };
        const access_token = this.jwtService.sign(payload);
        return { access_token, user };
    }

    async generateToken(login: string, password: string) {
        const user = await this.userService.findByLoginAndPassword(login, password);
        const payload = { sub: user.id };
        const access_token = this.jwtService.sign(payload);
        return { access_token, user };
    }
}