import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LocalStrategy } from 'src/guards/local.strategy';
import { JwtStrategy } from 'src/guards/jwt.strategy';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: 'JWT_SECRET',
            signOptions: { expiresIn: '3600s' },
            
        }),
        TypeOrmModule.forFeature([User]) // добавить эту строку

    ],
    providers: [AuthService, LocalStrategy, JwtStrategy, UserService],
})
export class AuthModule { }