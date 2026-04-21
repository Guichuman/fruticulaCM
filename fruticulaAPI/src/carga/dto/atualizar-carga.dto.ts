import { IsIn, IsInt, IsOptional } from 'class-validator';
import { StatusCargaEnum } from 'src/compartilhado/enums/status-carga.enum';

export class AtualizarCargaDto {
  @IsOptional()
  @IsIn(Object.values(StatusCargaEnum))
  status?: StatusCargaEnum;

  @IsOptional()
  @IsInt({ message: 'Total de blocos deve ser um número inteiro' })
  totalBlocos?: number;

  @IsOptional()
  @IsInt({ message: 'Máximo de caixas deve ser um número inteiro' })
  maxCaixas?: number;
}
