import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fruta } from './entities/fruta.entity';

@Injectable()
export class FrutaConsultaService {
  constructor(
    @InjectRepository(Fruta)
    private readonly repositorio: Repository<Fruta>,
  ) {}

  async buscarTodos(): Promise<Fruta[]> {
    return this.repositorio.find();
  }

  async buscarPorId(id: number): Promise<Fruta> {
    const fruta = await this.repositorio.findOne({
      where: { id },
      relations: { tiposFruta: true },
    });
    if (!fruta) {
      throw new NotFoundException(`Fruta com ID ${id} não encontrada`);
    }
    return fruta;
  }
}
