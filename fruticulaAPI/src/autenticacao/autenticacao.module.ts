import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAutenticacaoGuard } from './guards/jwt-autenticacao.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret: configService.get<string>('JWT_SEGREDO') ?? '',
        signOptions: {
          expiresIn: (configService.get('JWT_EXPIRACAO') || '24h') as unknown as number,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy, JwtAutenticacaoGuard],
  exports: [JwtModule, JwtAutenticacaoGuard],
})
export class AutenticacaoModule {}
