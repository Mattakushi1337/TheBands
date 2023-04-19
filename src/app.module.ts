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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'C:/sqlite/TheBands.db',
      entities: [User, Form],
      synchronize: false
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'JWT_SECRET',
      signOptions: { expiresIn: '1d' },
    }),
    UserModule,
    FormModule,
    TypeOrmModule.forFeature([Form]),
  ],
  controllers: [AuthController, FormController],
  providers: [UserService, AuthService, FormService],
  exports: [UserService, AuthService]
})
export class AppModule { }