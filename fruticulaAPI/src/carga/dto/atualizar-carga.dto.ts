import { IsIn, IsNumber, IsOptional } from 'class-validator';
import { StatusCargaEnum } from 'src/compartilhado/enums/status-carga.enum';

export class AtualizarCargaDto {
  @IsOptional()
  @IsIn(Object.values(StatusCargaEnum))
  status?: StatusCargaEnum;

  @IsOptional()
  @IsNumber()
  totalBlocos?: number;

  @IsOptional()
  @IsNumber()
  maxCaixas?: number;
}
