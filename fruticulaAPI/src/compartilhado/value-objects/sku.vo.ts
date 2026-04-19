import { BadRequestException } from '@nestjs/common';
import { ValueObject } from './value-object.base';

export class SkuVO extends ValueObject<number> {
  constructor(valor: number) {
    super(valor);
  }

  protected validar(valor: number): void {
    if (valor === undefined || valor === null) {
      throw new BadRequestException('SKU é obrigatório');
    }
    if (!Number.isInteger(valor)) {
      throw new BadRequestException('SKU deve ser um número inteiro');
    }
    if (valor <= 0) {
      throw new BadRequestException('SKU deve ser maior que zero');
    }
    if (valor > 9999999) {
      throw new BadRequestException('SKU não pode ser maior que 9999999');
    }
  }

  static criar(valor: number): SkuVO {
    return new SkuVO(valor);
  }
}
