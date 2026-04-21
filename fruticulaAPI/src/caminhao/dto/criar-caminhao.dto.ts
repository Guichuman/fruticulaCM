import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CriarCaminhaoDto {
  @IsString({ message: 'Placa deve ser uma string' })
  @IsNotEmpty({ message: 'Placa é obrigatória' })
  @MaxLength(10, { message: 'Placa deve ter no máximo 10 caracteres' })
  placa: string;

  @IsString({ message: 'Modelo deve ser uma string' })
  @IsNotEmpty({ message: 'Modelo é obrigatório' })
  @MaxLength(32, { message: 'Modelo deve ter no máximo 32 caracteres' })
  modelo: string;

  @IsInt({ message: 'Quantidade de blocos deve ser um número inteiro' })
  @IsPositive({ message: 'Quantidade de blocos deve ser positiva' })
  qtdBlocos: number;

  @IsInt({ message: 'ID do motorista deve ser um número inteiro' })
  @IsPositive({ message: 'ID do motorista deve ser positivo' })
  @IsOptional()
  idMotorista?: number;

  @IsIn(['S', 'N'], { message: 'palletBaixo deve ser S ou N' })
  @IsOptional()
  palletBaixo?: string;
}
