import { IsInt, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class AtualizarTipoFrutaEmbalagemDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @IsOptional()
  @MaxLength(32, { message: 'Nome deve ter no máximo 32 caracteres' })
  nome?: string;

  @IsInt({ message: 'SKU deve ser um número inteiro' })
  @IsPositive({ message: 'SKU deve ser positivo' })
  @IsOptional()
  sku?: number;
}
