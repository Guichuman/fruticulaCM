import { PartialType } from '@nestjs/mapped-types';
import { CriarMotoristaDto } from './criar-motorista.dto';
import { IsIn, IsOptional } from 'class-validator';
import { StatusMotoristaEnum } from 'src/compartilhado/enums/status-motorista.enum';

export class AtualizarMotoristaDto extends PartialType(CriarMotoristaDto) {
  @IsOptional()
  @IsIn(Object.values(StatusMotoristaEnum))
  status?: StatusMotoristaEnum;
}
