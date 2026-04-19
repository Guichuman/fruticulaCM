import { BadRequestException } from '@nestjs/common';
import { ValueObject } from './value-object.base';

export class TelefoneVO extends ValueObject<string> {
  constructor(valor: string) {
    const telefoneLimpo = valor?.replace(/[^\d]/g, '') ?? '';
    super(telefoneLimpo);
  }

  protected validar(valor: string): void {
    if (!valor) {
      throw new BadRequestException('Telefone é obrigatório');
    }
    if (valor.length < 10 || valor.length > 11) {
      throw new BadRequestException(
        'Telefone deve ter 10 dígitos (fixo) ou 11 dígitos (celular)',
      );
    }
  }

  get valorFormatado(): string {
    if (this._valor.length === 11) {
      return this._valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return this._valor.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  static criar(valor: string): TelefoneVO {
    return new TelefoneVO(valor);
  }
}
