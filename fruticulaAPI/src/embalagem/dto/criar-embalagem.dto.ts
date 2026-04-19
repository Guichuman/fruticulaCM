import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CriarEmbalagemDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome da embalagem é obrigatório' })
  @MaxLength(255, { message: 'Nome deve ter no máximo 255 caracteres' })
  nome: string;
}
