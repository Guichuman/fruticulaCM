import { PartialType } from '@nestjs/mapped-types';
import { CriarCaminhaoDto } from './criar-caminhao.dto';
import { IsIn, IsOptional } from 'class-validator';
import { StatusCaminhaoEnum } from 'src/compartilhado/enums/status-caminhao.enum';

export class AtualizarCaminhaoDto extends PartialType(CriarCaminhaoDto) {
  @IsOptional()
  @IsIn(Object.values(StatusCaminhaoEnum))
  status?: StatusCaminhaoEnum;
}
