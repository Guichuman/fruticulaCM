import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CriarPalletFrutaDto {
  @IsPositive({ message: 'Quantidade de caixas deve ser positiva' })
  @IsNotEmpty({ message: 'Quantidade de caixas é obrigatória' })
  quantidadeCaixa: number;

  @IsNumber({}, { message: 'ID do pallet deve ser um número' })
  @IsNotEmpty({ message: 'ID do pallet é obrigatório' })
  idPallet: number;

  @IsNumber({}, { message: 'ID de tipo-fruta-embalagem deve ser um número' })
  @IsNotEmpty({ message: 'ID de tipo-fruta-embalagem é obrigatório' })
  idTipoFrutaEmbalagem: number;
}
