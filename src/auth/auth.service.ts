import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { AccessData } from './access-data.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<AccessData> {
    const user = await this.userRepository.validateCredentials(
      authCredentialsDto,
    );
    const payload: JwtPayload = { username: user.username, user_id: user.id };

    const token = this.jwtService.sign(payload);

    return { token, data: payload };
  }

  async validateUser(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<User> | null {
    const user = await this.userRepository.validateCredentials(
      authCredentialsDto,
    );
    if (user) {
      return user;
    }
    return null;
  }
}
