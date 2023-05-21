import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { Band } from 'src/band/band.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(Band)
    private bandRepository: Repository<Band>,
  ) { }

  async register(login: string, password: string, userName: string) {
    const user = await this.userService.create(login, password, userName);
    const payload = { sub: user.id };
    const access_token = this.jwtService.sign(payload);
    return { access_token, user };
  }

  async generateToken(login: string, password: string) {
    const user = await this.userService.findByLoginAndPassword(login, password);
    const payload = { sub: user.id };
    const access_token = this.jwtService.sign(payload);
    const bandId = await this.getUserBandId(user.id);
    console.log("BandId gen", bandId);
    return { access_token, userId: user.id, bandId };
  }

  async verifyToken(token: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      return decoded;
    } catch (err) {
      return null;
    }
  }

  async getUserBandId(userId: number): Promise<number> {
    const band = await this.bandRepository.findOne({ where: { creatorId: userId } });
    return band?.id;
  }
}
