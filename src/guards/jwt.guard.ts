import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private authService: AuthService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['access_token'];
    console.log('token:', token);

    if (!token) {
      return false;
    }

    try {
      const decodedToken = this.authService.verifyToken(token);

      console.log('decoded token:', decodedToken); 

      request.user = decodedToken;
      return true;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}