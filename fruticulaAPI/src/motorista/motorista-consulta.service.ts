import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Motorista } from './entities/motorista.entity';

@Injectable()
export class MotoristaConsultaService {
  constructor(
    @InjectRepository(Motorista)
    private readonly repositorio: Repository<Motorista>,
  ) {}

  async buscarTodos(): Promise<Motorista[]> {
    return this.repositorio.find();
  }

  async buscarPorId(id: number): Promise<Motorista> {
    const motorista = await this.repositorio.findOne({ where: { id } });
    if (!motorista) {
      throw new NotFoundException(`Motorista com ID ${id} não encontrado`);
    }
    return motorista;
  }
}
