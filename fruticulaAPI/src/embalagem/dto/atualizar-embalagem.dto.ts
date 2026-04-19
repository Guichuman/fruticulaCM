import { PartialType } from '@nestjs/mapped-types';
import { CriarEmbalagemDto } from './criar-embalagem.dto';

export class AtualizarEmbalagemDto extends PartialType(CriarEmbalagemDto) {}
