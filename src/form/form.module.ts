import { Module } from '@nestjs/common';
import { FormController } from './form.controller';
import { FormService } from './form.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Form } from './form.entity';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Form, User]), JwtModule.register({
        secret: 'JWT_SECRET',
        signOptions: { expiresIn: '1d' },
      }), UserModule],
    controllers: [FormController],
    providers: [FormService, AuthService, UserService],
    exports: [FormService]
})
export class FormModule { }