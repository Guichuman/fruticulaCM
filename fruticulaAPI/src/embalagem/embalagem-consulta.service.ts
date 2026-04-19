import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Embalagem } from './entities/embalagem.entity';

@Injectable()
export class EmbalagemConsultaService {
  constructor(
    @InjectRepository(Embalagem)
    private readonly repositorio: Repository<Embalagem>,
  ) {}

  async buscarTodos(): Promise<Embalagem[]> {
    return this.repositorio.find();
  }

  async buscarPorId(id: number): Promise<Embalagem> {
    const embalagem = await this.repositorio.findOne({
      where: { id },
    });
    if (!embalagem) {
      throw new NotFoundException(`Embalagem com ID ${id} não encontrada`);
    }
    return embalagem;
  }
}
