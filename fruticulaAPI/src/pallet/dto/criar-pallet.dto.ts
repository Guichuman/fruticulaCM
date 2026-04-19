import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';
import { LadoPalletEnum } from 'src/compartilhado/enums/lado-pallet.enum';

export class CriarPalletDto {
  @IsIn(Object.values(LadoPalletEnum), { message: 'Lado deve ser MA, MB, AA ou AB' })
  @IsNotEmpty({ message: 'Lado é obrigatório' })
  lado: LadoPalletEnum;

  @IsNumber({}, { message: 'Bloco deve ser um número' })
  @IsNotEmpty({ message: 'Bloco é obrigatório' })
  bloco: number;

  @IsNumber({}, { message: 'ID da carga deve ser um número' })
  @IsNotEmpty({ message: 'ID da carga é obrigatório' })
  idCarga: number;
}
