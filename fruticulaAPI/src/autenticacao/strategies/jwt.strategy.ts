import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface PayloadJwt {
  sub: number;
  username: string;
  nome: string;
  perfil: string;
}

export interface UsuarioAutenticado {
  id: number;
  username: string;
  nome: string;
  perfil: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SEGREDO') ?? '',
    });
  }

  async validate(payload: PayloadJwt): Promise<UsuarioAutenticado> {
    return {
      id: payload.sub,
      username: payload.username,
      nome: payload.nome,
      perfil: payload.perfil,
    };
  }
}
