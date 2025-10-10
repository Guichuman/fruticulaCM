import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
export class CreateCaminhaoDto {
  @IsString()
  @IsNotEmpty()
  placa: string;

  @IsPositive()
  @IsNotEmpty()
  qtdBlocos: number;

  @IsString()
  status: string;

  @IsNumber()
  motoristaId: number;
}
