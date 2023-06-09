import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BandModule } from '../band/band.module';
import { Application } from './application.entity';
import { AppService } from 'src/app.service';
import { ApplicationController } from './application.controller';
import { Band } from 'src/band/band.entity';
import { User } from 'src/user/user.entity';
import { ApplicationService } from './application.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Member } from 'src/member/member.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Application, Band, User, Member, Repository]), JwtModule.register({
        secret: 'JWT_SECRET',
        signOptions: { expiresIn: '1d' },
    }), BandModule],
    providers: [AuthService, ApplicationService, UserService, Repository],
    controllers: [ApplicationController],
})
export class ApplicationModule { }