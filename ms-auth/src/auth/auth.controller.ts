import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/signin.dto';
import { SignUpDto } from './dtos/signup.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body.email, body.password);
  }

  @Post('signout')
  @UseGuards(AuthGuard)
  async signOut(@Request() request: Request) {
    const currentUser = request['currentUser'];
    return this.authService.signOut(currentUser.jwtPayload.sub);
  }

  @Post('signup')
  async register(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }
}
