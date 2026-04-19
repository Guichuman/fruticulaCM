import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Caminhao } from './entities/caminhao.entity';

@Injectable()
export class CaminhaoConsultaService {
  constructor(
    @InjectRepository(Caminhao)
    private readonly repositorio: Repository<Caminhao>,
  ) {}

  async buscarTodos(): Promise<Caminhao[]> {
    return this.repositorio.find({ relations: { motorista: true } });
  }

  async buscarPorId(id: number): Promise<Caminhao> {
    const caminhao = await this.repositorio.findOne({
      where: { id },
      relations: { motorista: true },
    });
    if (!caminhao) {
      throw new NotFoundException(`Caminhão com ID ${id} não encontrado`);
    }
    return caminhao;
  }
}
