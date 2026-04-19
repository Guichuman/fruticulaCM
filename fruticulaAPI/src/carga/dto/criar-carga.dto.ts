import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CriarCargaDto {
  @IsPositive({ message: 'Total de blocos deve ser positivo' })
  @IsNotEmpty({ message: 'Total de blocos é obrigatório' })
  totalBlocos: number;

  @IsPositive({ message: 'Máximo de caixas deve ser positivo' })
  @IsNotEmpty({ message: 'Máximo de caixas é obrigatório' })
  maxCaixas: number;

  @IsNumber({}, { message: 'ID do caminhão deve ser um número' })
  @IsNotEmpty({ message: 'ID do caminhão é obrigatório' })
  idCaminhao: number;

  @IsNumber({}, { message: 'ID do motorista deve ser um número' })
  @IsNotEmpty({ message: 'ID do motorista é obrigatório' })
  idMotorista: number;
}
