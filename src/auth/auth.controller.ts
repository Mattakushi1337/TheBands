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
        console.log('Register request received:', body);
        const user = await this.authService.register(body.login, body.password);
        res.cookie('access_token', user.access_token, { httpOnly: true, maxAge: 3600 * 1000 });
        console.log('User created:', user);
        return res.send(user);
    }

    @Post('login')
    async login(@Body() body: { login: string; password: string }, @Res() res: Response) {
        const user = await this.authService.generateToken(body.login, body.password);
        res.cookie('userId', user.userId, { maxAge: 3600 * 1000, httpOnly: true });
        res.cookie('userLogin', body.login, { httpOnly: true, maxAge: 3600 * 1000 });
        res.cookie('access_token', user.access_token, { httpOnly: true, maxAge: 3600 * 1000 });
        return res.send(user);
    }

    @Post('logout')
    async logout(@Res() res: Response) {
        res.clearCookie('access_token');
        res.clearCookie('userLogin');
        res.clearCookie('userId');
        return res.send('Вы успешно вышли из аккаунта.');
    }

    @Get('/all')
    async findAll(): Promise<User[]> {
        return await this.userService.findAll();
    }
}