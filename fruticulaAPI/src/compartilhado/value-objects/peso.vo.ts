import { BadRequestException } from '@nestjs/common';
import { ValueObject } from './value-object.base';

export class PesoVO extends ValueObject<number> {
  private static readonly PESO_MAXIMO = 999999;

  constructor(valor: number) {
    super(valor);
  }

  protected validar(valor: number): void {
    if (valor === undefined || valor === null) {
      throw new BadRequestException('Peso é obrigatório');
    }
    if (typeof valor !== 'number' || isNaN(valor)) {
      throw new BadRequestException('Peso deve ser um número válido');
    }
    if (valor <= 0) {
      throw new BadRequestException('Peso deve ser maior que zero');
    }
    if (valor > PesoVO.PESO_MAXIMO) {
      throw new BadRequestException(
        `Peso não pode ser maior que ${PesoVO.PESO_MAXIMO}`,
      );
    }
  }

  static criar(valor: number): PesoVO {
    return new PesoVO(valor);
  }
}
