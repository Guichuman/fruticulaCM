import { IsInt, IsNotEmpty, IsPositive, IsString, MaxLength } from 'class-validator';

export class CriarTipoFrutaEmbalagemDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MaxLength(32, { message: 'Nome deve ter no máximo 32 caracteres' })
  nome: string;

  @IsInt({ message: 'SKU deve ser um número inteiro' })
  @IsPositive({ message: 'SKU deve ser positivo' })
  sku: number;

  @IsInt({ message: 'idTipoFruta deve ser um número inteiro' })
  @IsPositive({ message: 'idTipoFruta deve ser positivo' })
  idTipoFruta: number;
}
