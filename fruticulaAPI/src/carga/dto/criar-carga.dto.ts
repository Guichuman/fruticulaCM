import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CriarCargaDto {
  @IsInt({ message: 'Total de blocos deve ser um número inteiro' })
  @IsPositive({ message: 'Total de blocos deve ser positivo' })
  @IsNotEmpty({ message: 'Total de blocos é obrigatório' })
  totalBlocos: number;

  @IsInt({ message: 'Máximo de caixas deve ser um número inteiro' })
  @IsPositive({ message: 'Máximo de caixas deve ser positivo' })
  @IsNotEmpty({ message: 'Máximo de caixas é obrigatório' })
  maxCaixas: number;

  @IsInt({ message: 'ID do caminhão deve ser um número inteiro' })
  @IsPositive({ message: 'ID do caminhão deve ser positivo' })
  idCaminhao: number;

  @IsInt({ message: 'ID do motorista deve ser um número inteiro' })
  @IsPositive({ message: 'ID do motorista deve ser positivo' })
  idMotorista: number;
}
