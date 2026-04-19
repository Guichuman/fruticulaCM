import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CriarUsuarioDto } from './criar-usuario.dto';
import { StatusUsuarioEnum } from 'src/compartilhado/enums/status-usuario.enum';

export class AtualizarUsuarioDto extends PartialType(CriarUsuarioDto) {
  @IsOptional()
  @IsEnum(StatusUsuarioEnum, { message: 'Status deve ser A (Ativo) ou I (Inativo)' })
  status?: StatusUsuarioEnum;
}
