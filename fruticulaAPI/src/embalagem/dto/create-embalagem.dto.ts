import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEmbalagemDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsNumber()
  @IsNotEmpty()
  frutaId: number;
}
