import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CriarFrutaDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome da fruta é obrigatório' })
  @MaxLength(255, { message: 'Nome deve ter no máximo 255 caracteres' })
  nome: string;
}
