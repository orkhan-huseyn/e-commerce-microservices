import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dtos/signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('incorrect password');
    }

    const jwtPayload = {
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
      image: user.image,
      emailConfirmed: user.emailConfirmed,
    };
    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: '15m',
    });
    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id },
      {
        expiresIn: '30d',
      },
    );

    await this.cacheManager.set(
      user.id,
      JSON.stringify({
        accessToken,
        refreshToken,
        jwtPayload,
      }),
    );

    // TODO: add new request to RabbitMQ

    return {
      accessToken,
      refreshToken,
    };
  }

  async signUp(signUpDto: SignUpDto) {
    const existingUser = await this.userRepository.findOneBy({
      email: signUpDto.email,
    });

    if (existingUser) {
      throw new BadRequestException('email already in use');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(signUpDto.password, salt);

    const user = this.userRepository.create({
      email: signUpDto.email,
      password: hashedPassword,
      fullName: signUpDto.fullName,
    });

    return this.userRepository.save(user);
  }

  async signOut(userId: string) {
    await this.cacheManager.del(userId);
  }
}
