import { Controller, Post, Body, Res, Get } from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly userService: UserService) { }

    @Post('register')
    async register(@Body() body: { login: string; password: string }, @Res() res: Response) {
        const user = await this.authService.register(body.login, body.password);
        res.cookie('access_token', user.access_token, { httpOnly: true, maxAge: 3600 * 1000 });
        return res.send(user);
    }

    @Post('login')
    async login(@Body() body: { login: string; password: string }, @Res() res: Response) {
        const user = await this.authService.generateToken(body.login, body.password);
        res.cookie('access_token', user.access_token, { httpOnly: true, maxAge: 3600 * 1000 });
        return res.send(user);
    }

    @Get('/all')
    async findAll(): Promise<User[]> {
        return await this.userService.findAll();
    }
}