import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateFrutaDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsPositive()
  peso: number;

  @IsString()
  @IsNotEmpty()
  embalagem: string;

  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsString()
  @IsNotEmpty()
  sku: string;
}
