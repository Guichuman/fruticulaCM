import { MethodNotAllowedException } from '@nestjs/common';

export class PossuiCargasException extends MethodNotAllowedException {
  constructor(campo: string) {
    super(`${campo} possui cargas cadastradas, não é possível excluir.`);
  }
}
