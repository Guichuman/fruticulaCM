import { IsInt, IsNotEmpty, IsPositive, IsString, MaxLength } from 'class-validator';

export class CriarTipoFrutaDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  nome: string;

  @IsInt({ message: 'ID da fruta deve ser um número inteiro' })
  @IsPositive({ message: 'ID da fruta deve ser positivo' })
  idFruta: number;
}
