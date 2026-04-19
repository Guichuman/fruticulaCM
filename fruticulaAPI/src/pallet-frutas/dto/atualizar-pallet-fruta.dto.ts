import { PartialType } from '@nestjs/mapped-types';
import { CriarPalletFrutaDto } from './criar-pallet-fruta.dto';

export class AtualizarPalletFrutaDto extends PartialType(CriarPalletFrutaDto) {}
