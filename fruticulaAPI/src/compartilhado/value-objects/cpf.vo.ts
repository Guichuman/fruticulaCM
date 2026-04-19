import { BadRequestException } from '@nestjs/common';
import { ValueObject } from './value-object.base';

export class CpfVO extends ValueObject<string> {
  constructor(valor: string) {
    const cpfLimpo = valor?.replace(/[^\d]/g, '') ?? '';
    super(cpfLimpo);
  }

  protected validar(valor: string): void {
    if (!valor) {
      throw new BadRequestException('CPF é obrigatório');
    }
    if (valor.length !== 11) {
      throw new BadRequestException('CPF deve ter 11 dígitos');
    }
    if (!this.validarDigitosVerificadores(valor)) {
      throw new BadRequestException('CPF inválido');
    }
  }

  private validarDigitosVerificadores(cpf: string): boolean {
    // Rejeitar sequências iguais (ex: 111.111.111-11)
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf[i]) * (10 - i);
    }
    let primeiroDigito = (soma * 10) % 11;
    if (primeiroDigito === 10 || primeiroDigito === 11) primeiroDigito = 0;
    if (primeiroDigito !== parseInt(cpf[9])) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf[i]) * (11 - i);
    }
    let segundoDigito = (soma * 10) % 11;
    if (segundoDigito === 10 || segundoDigito === 11) segundoDigito = 0;
    return segundoDigito === parseInt(cpf[10]);
  }

  get valorFormatado(): string {
    return this._valor.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      '$1.$2.$3-$4',
    );
  }

  static criar(valor: string): CpfVO {
    return new CpfVO(valor);
  }
}
