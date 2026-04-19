import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Embalagem } from '../entities/embalagem.entity';
import { EmbalagemConsultaService } from '../embalagem-consulta.service';

@Injectable()
export class RemoverEmbalagemUseCase {
  constructor(
    @InjectRepository(Embalagem)
    private readonly repositorio: Repository<Embalagem>,
    private readonly consultaService: EmbalagemConsultaService,
  ) {}

  async executar(id: number): Promise<void> {
    const embalagem = await this.consultaService.buscarPorId(id);
    await this.repositorio.remove(embalagem);
  }
}
