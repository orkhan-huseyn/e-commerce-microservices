import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'] as string;
    if (!authHeader) {
      throw new UnauthorizedException('authorization headers is not present');
    }

    const [, accessToken] = authHeader.split(' ');
    try {
      const payload = await this.jwtService.verifyAsync(accessToken);
      const userId = payload.sub;
      const storedCredentials = await this.cacheManager.get<string>(userId);
      if (!storedCredentials) {
        throw new UnauthorizedException('you need to sign in again');
      }
      request['currentUser'] = JSON.parse(storedCredentials);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }

    return true;
  }
}
