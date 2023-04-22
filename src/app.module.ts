import { AuthController } from './auth/auth.controller';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { User } from './user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { FormService } from './form/form.service';
import { FormController } from './form/form.controller';
import { UserModule } from './user/user.module';
import { FormModule } from './form/form.module';
import { Form } from './form/form.entity';
import { BandService } from './band/band.service';
import { BandController } from './band/band.controller';
import { BandModule } from './band/band.module';
import { Band } from './band/band.entity';
import { Member } from './member/member.entity';
import { ApplicationController } from './application/application.controller';
import { ApplicationService } from './application/application.service';
import { ApplicationModule } from './application/application.module';
import { Application } from './application/application.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'C:/sqlite/TheBands.db',
      entities: [User, Form, Band, Application, Member],
      synchronize: false
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'JWT_SECRET',
      signOptions: { expiresIn: '1d' },
    }),
    UserModule,
    FormModule,
    BandModule,
    ApplicationModule,
    TypeOrmModule.forFeature([Form]),
    TypeOrmModule.forFeature([Band]),
    TypeOrmModule.forFeature([Application]),
    TypeOrmModule.forFeature([Member]),
  ],
  controllers: [AuthController, FormController, BandController, ApplicationController],
  providers: [UserService, AuthService, FormService, BandService, ApplicationService],
  exports: [UserService, AuthService]
})
export class AppModule { }