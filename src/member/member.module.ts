import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Member } from './member.entity';
import { Band } from 'src/band/band.entity';
import { UserModule } from 'src/user/user.module';
import { BandModule } from 'src/band/band.module';
import { MemberService } from './member.service';
import { BandService } from 'src/band/band.service';
import { MemberController } from './member.controller';
import { Repository } from 'typeorm';
import { Application } from 'src/application/application.entity';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([Member, User, Band, Application]),
        UserModule,
        BandModule,
    ],
    controllers: [MemberController],
    providers: [MemberService, AuthService, UserService, JwtService],
    exports: [MemberService, TypeOrmModule],
})
export class MemberModule { }
