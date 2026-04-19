export abstract class ValueObject<T> {
  protected readonly _valor: T;

  constructor(valor: T) {
    this._valor = valor;
    this.validar(this._valor);
  }

  get valor(): T {
    return this._valor;
  }

  equals(outro: ValueObject<T>): boolean {
    if (!outro) return false;
    return JSON.stringify(this._valor) === JSON.stringify(outro._valor);
  }

  protected abstract validar(valor: T): void;

  toString(): string {
    return String(this._valor);
  }
}
