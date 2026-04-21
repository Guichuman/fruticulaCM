import { IsEnum, IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { LadoPalletEnum } from 'src/compartilhado/enums/lado-pallet.enum';

export class CriarPalletDto {
  @IsEnum(LadoPalletEnum, { message: 'Lado deve ser MA, MB, AA ou AB' })
  @IsNotEmpty({ message: 'Lado é obrigatório' })
  lado: LadoPalletEnum;

  @IsInt({ message: 'Bloco deve ser um número inteiro' })
  @IsPositive({ message: 'Bloco deve ser positivo' })
  bloco: number;

  @IsInt({ message: 'ID da carga deve ser um número inteiro' })
  @IsPositive({ message: 'ID da carga deve ser positivo' })
  idCarga: number;
}
