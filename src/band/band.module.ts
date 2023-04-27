import { Module } from '@nestjs/common';
import { BandController } from './band.controller';
import { BandService } from './band.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Band } from './band.entity';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Band, User, Repository]),
    JwtModule.register({
      secret: 'JWT_SECRET',
      signOptions: { expiresIn: '1d' },
    }),
    UserModule,
  ],
  controllers: [BandController],
  providers: [BandService, AuthService, UserService, Repository],
  exports: [BandService],
})
export class BandModule {}