import { IsNotEmpty, IsString } from 'class-validator';
export class CreateMotoristaDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsNotEmpty()
  telefone: string;

  @IsNotEmpty()
  cpf: string;

  @IsString()
  status: string;
}
