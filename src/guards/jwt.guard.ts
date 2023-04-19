import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    console.log('token:', token); // <--- добавьте эту строку

    if (!token) {
      return false;
    }

    try {
      const user = this.authService.verifyToken(token); 

      console.log('user:', user); // <--- добавьте эту строку

      request.user = user;
      return true;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}