import { BadRequestException } from '@nestjs/common';
import { ValueObject } from './value-object.base';

export class NomeVO extends ValueObject<string> {
  private static readonly TAMANHO_MINIMO = 2;
  private static readonly TAMANHO_MAXIMO = 255;

  constructor(valor: string) {
    super(valor?.trim() ?? '');
  }

  protected validar(valor: string): void {
    if (!valor || valor.trim().length === 0) {
      throw new BadRequestException('O nome não pode ser vazio');
    }
    if (valor.length < NomeVO.TAMANHO_MINIMO) {
      throw new BadRequestException(
        `O nome deve ter pelo menos ${NomeVO.TAMANHO_MINIMO} caracteres`,
      );
    }
    if (valor.length > NomeVO.TAMANHO_MAXIMO) {
      throw new BadRequestException(
        `O nome deve ter no máximo ${NomeVO.TAMANHO_MAXIMO} caracteres`,
      );
    }
  }

  static criar(valor: string): NomeVO {
    return new NomeVO(valor);
  }
}
