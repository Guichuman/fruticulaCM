import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoFrutaEmbalagem } from './entities/tipo-fruta-embalagem.entity';

@Injectable()
export class TipoFrutaEmbalagemConsultaService {
  constructor(
    @InjectRepository(TipoFrutaEmbalagem)
    private readonly repositorio: Repository<TipoFrutaEmbalagem>,
  ) {}

  async buscarPorTipo(idTipoFruta: number): Promise<TipoFrutaEmbalagem[]> {
    return this.repositorio.find({ where: { idTipoFruta } });
  }

  async buscarPorId(id: number): Promise<TipoFrutaEmbalagem> {
    const embalagem = await this.repositorio.findOne({ where: { id } });
    if (!embalagem) {
      throw new NotFoundException(`Embalagem com ID ${id} não encontrada`);
    }
    return embalagem;
  }
}
