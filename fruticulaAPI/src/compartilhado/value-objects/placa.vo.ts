import { BadRequestException } from '@nestjs/common';
import { ValueObject } from './value-object.base';

export class PlacaVO extends ValueObject<string> {
  private static readonly REGEX_PLACA_ANTIGA = /^[A-Z]{3}\d{4}$/;
  private static readonly REGEX_PLACA_MERCOSUL = /^[A-Z]{3}\d{1}[A-Z]{1}\d{2}$/;

  constructor(valor: string) {
    const placaNormalizada = valor?.toUpperCase().replace(/[^A-Z0-9]/g, '') ?? '';
    super(placaNormalizada);
  }

  protected validar(valor: string): void {
    if (!valor) {
      throw new BadRequestException('Placa é obrigatória');
    }
    const ehValida =
      PlacaVO.REGEX_PLACA_ANTIGA.test(valor) ||
      PlacaVO.REGEX_PLACA_MERCOSUL.test(valor);

    if (!ehValida) {
      throw new BadRequestException(
        'Placa inválida. Use o formato antigo (ABC1234) ou Mercosul (ABC1D23)',
      );
    }
  }

  static criar(valor: string): PlacaVO {
    return new PlacaVO(valor);
  }
}
