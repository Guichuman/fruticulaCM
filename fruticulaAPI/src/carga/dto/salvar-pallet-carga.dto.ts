import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
  Max,
  ValidateNested,
} from 'class-validator';
import { LadoPalletEnum } from 'src/compartilhado/enums/lado-pallet.enum';

class ItemPalletDto {
  @IsInt({ message: 'ID de tipo-fruta-embalagem deve ser um número inteiro' })
  @IsPositive({ message: 'ID de tipo-fruta-embalagem deve ser positivo' })
  idTipoFrutaEmbalagem: number;

  @IsInt({ message: 'Quantidade de caixas deve ser um número inteiro' })
  @IsPositive({ message: 'Quantidade de caixas deve ser positiva' })
  @Max(1000, { message: 'Quantidade não pode exceder 1000 caixas' })
  quantidadeCaixa: number;
}

export class SalvarPalletCargaDto {
  @IsInt({ message: 'Bloco deve ser um número inteiro' })
  @IsPositive({ message: 'Bloco deve ser positivo' })
  bloco: number;

  @IsEnum(LadoPalletEnum, { message: 'Lado inválido' })
  @IsNotEmpty({ message: 'Lado é obrigatório' })
  lado: LadoPalletEnum;

  @IsArray({ message: 'Itens deve ser uma lista' })
  @ArrayMinSize(1, { message: 'O pallet deve ter pelo menos um item' })
  @ValidateNested({ each: true })
  @Type(() => ItemPalletDto)
  itens: ItemPalletDto[];
}
