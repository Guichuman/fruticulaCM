import { IsInt, IsNotEmpty, IsNumber, IsPositive, Max } from 'class-validator';

export class CriarPalletFrutaDto {
  @IsInt({ message: 'Quantidade de caixas deve ser um número inteiro' })
  @IsPositive({ message: 'Quantidade de caixas deve ser positiva' })
  @Max(1000, { message: 'Quantidade não pode exceder 1000 caixas' })
  @IsNotEmpty({ message: 'Quantidade de caixas é obrigatória' })
  quantidadeCaixa: number;

  @IsNumber({}, { message: 'ID do pallet deve ser um número' })
  @IsNotEmpty({ message: 'ID do pallet é obrigatório' })
  idPallet: number;

  @IsNumber({}, { message: 'ID de tipo-fruta-embalagem deve ser um número' })
  @IsNotEmpty({ message: 'ID de tipo-fruta-embalagem é obrigatório' })
  idTipoFrutaEmbalagem: number;
}
