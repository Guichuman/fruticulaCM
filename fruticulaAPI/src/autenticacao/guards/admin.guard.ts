import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PerfilUsuarioEnum } from 'src/compartilhado/enums/perfil-usuario.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const usuario = request.user;
    if (!usuario || usuario.perfil !== PerfilUsuarioEnum.ADMINISTRADOR) {
      throw new ForbiddenException('Acesso restrito a administradores');
    }
    return true;
  }
}
