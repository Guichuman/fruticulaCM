import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
export class CreateCargaDto {
  @IsPositive()
  @IsNotEmpty()
  totalBlocos: number;

  @IsPositive()
  @IsNotEmpty()
  maxCaixas: number;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsNumber()
  @IsNotEmpty()
  idCaminhao: number;

  @IsNumber()
  @IsNotEmpty()
  idMotorista: number;
}
