import { PartialType } from '@nestjs/mapped-types';
import { CriarPalletDto } from './criar-pallet.dto';

export class AtualizarPalletDto extends PartialType(CriarPalletDto) {}
