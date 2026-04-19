import { PartialType } from '@nestjs/mapped-types';
import { CriarFrutaDto } from './criar-fruta.dto';

export class AtualizarFrutaDto extends PartialType(CriarFrutaDto) {}
