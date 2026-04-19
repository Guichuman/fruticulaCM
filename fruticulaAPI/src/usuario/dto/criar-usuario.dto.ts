import { IsString, IsNotEmpty, MinLength, MaxLength, IsEnum, IsOptional } from 'class-validator';
import { PerfilUsuarioEnum } from 'src/compartilhado/enums/perfil-usuario.enum';

export class CriarUsuarioDto {
  @IsString({ message: 'Username deve ser uma string' })
  @IsNotEmpty({ message: 'O nome de usuário é obrigatório' })
  @MinLength(3, { message: 'O nome de usuário deve ter no mínimo 3 caracteres' })
  @MaxLength(100, { message: 'O nome de usuário deve ter no máximo 100 caracteres' })
  username: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  senha: string;

  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MinLength(2, { message: 'O nome deve ter no mínimo 2 caracteres' })
  @MaxLength(150, { message: 'O nome deve ter no máximo 150 caracteres' })
  nome: string;

  @IsOptional()
  @IsEnum(PerfilUsuarioEnum, { message: 'Perfil deve ser A (Administrador) ou F (Funcionário)' })
  perfil?: PerfilUsuarioEnum;
}
