import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoFruta } from './entities/tipo-fruta.entity';

@Injectable()
export class TipoFrutaConsultaService {
  constructor(
    @InjectRepository(TipoFruta)
    private readonly repositorio: Repository<TipoFruta>,
  ) {}

  async buscarPorFruta(idFruta: number): Promise<TipoFruta[]> {
    return this.repositorio.find({ where: { idFruta } });
  }

  async buscarPorId(id: number): Promise<TipoFruta> {
    const tipoFruta = await this.repositorio.findOne({ where: { id } });
    if (!tipoFruta) {
      throw new NotFoundException(`Tipo de fruta com ID ${id} não encontrado`);
    }
    return tipoFruta;
  }
}
