import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CriarTipoFrutaDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  nome: string;

  @IsNumber({}, { message: 'ID da fruta deve ser um número' })
  @IsNotEmpty({ message: 'ID da fruta é obrigatório' })
  idFruta: number;
}
