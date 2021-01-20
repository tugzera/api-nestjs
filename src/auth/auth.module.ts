import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from 'src/config/env';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: env.secret,
      signOptions: {
        expiresIn: '1h',
      },
    }),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
