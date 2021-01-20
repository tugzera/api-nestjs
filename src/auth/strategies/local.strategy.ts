import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { User } from '../user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    const authDto = { username, password };
    const user = await this.authService.validateUser(authDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
