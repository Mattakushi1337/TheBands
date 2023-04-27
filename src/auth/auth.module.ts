import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LocalStrategy } from 'src/guards/local.strategy';
import { JwtStrategy } from 'src/guards/jwt.strategy';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Band } from 'src/band/band.entity';
import { BandService } from 'src/band/band.service';
import { Repository } from 'typeorm';
import { UserModule } from 'src/user/user.module';
import { BandModule } from 'src/band/band.module';
import { AuthController } from './auth.controller';
import { MemberService } from 'src/member/member.service';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: 'JWT_SECRET',
            signOptions: { expiresIn: '3600s' },
            
        }),
        TypeOrmModule.forFeature([User, Band, Repository]),
        UserModule,
        BandModule

    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy, UserService, BandService, MemberService],
})
export class AuthModule { }