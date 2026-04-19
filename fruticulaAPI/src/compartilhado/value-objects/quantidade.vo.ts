import { BadRequestException } from '@nestjs/common';
import { ValueObject } from './value-object.base';

export class QuantidadeVO extends ValueObject<number> {
  private static readonly QUANTIDADE_MAXIMA = 99999;

  constructor(valor: number) {
    super(valor);
  }

  protected validar(valor: number): void {
    if (valor === undefined || valor === null) {
      throw new BadRequestException('Quantidade é obrigatória');
    }
    if (!Number.isInteger(valor)) {
      throw new BadRequestException('Quantidade deve ser um número inteiro');
    }
    if (valor < 0) {
      throw new BadRequestException('Quantidade não pode ser negativa');
    }
    if (valor > QuantidadeVO.QUANTIDADE_MAXIMA) {
      throw new BadRequestException(
        `Quantidade não pode ser maior que ${QuantidadeVO.QUANTIDADE_MAXIMA}`,
      );
    }
  }

  static criar(valor: number): QuantidadeVO {
    return new QuantidadeVO(valor);
  }
}
