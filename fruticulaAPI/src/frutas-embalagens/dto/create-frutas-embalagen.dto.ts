import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateFrutasEmbalagenDto {
  @IsPositive()
  @IsNotEmpty()
  peso: number;

  @IsPositive()
  @IsNotEmpty()
  sku: number;

  @IsPositive()
  @IsNotEmpty()
  frutaId: number;

  @IsPositive()
  @IsNotEmpty()
  embalagemId: number;

  @IsNotEmpty()
  tipo: string;
}
