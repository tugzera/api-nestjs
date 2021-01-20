import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = new User();
    user.username = username;
    user.password = await this.hashPassword(password, await bcrypt.genSalt(12));

    try {
      await user.save();
    } catch (error) {
      // duplicate code error
      if (error.code === '23505') {
        throw new ConflictException(`Username already exists`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateCredentials(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<User> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });
    if (user && (await user.isValidPassword(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    const hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
  }
}
