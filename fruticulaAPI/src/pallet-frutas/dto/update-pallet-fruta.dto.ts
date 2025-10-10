import { PartialType } from '@nestjs/mapped-types';
import { CreatePalletFrutaDto } from './create-pallet-fruta.dto';

export class UpdatePalletFrutaDto extends PartialType(CreatePalletFrutaDto) {}
