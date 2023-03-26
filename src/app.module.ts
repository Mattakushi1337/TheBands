import { AuthController } from './auth/auth.controller';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { User } from './user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'C:/sqlite/TheBands.db',
      entities: [User],
      synchronize: false
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [UserService, AuthService],
  exports: [UserService, AuthService]
})
export class AppModule { }