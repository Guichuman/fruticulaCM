import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carga } from '../entities/carga.entity';
import { CargaConsultaService } from '../carga-consulta.service';

@Injectable()
export class RemoverCargaUseCase {
  constructor(
    @InjectRepository(Carga)
    private readonly repositorio: Repository<Carga>,
    private readonly consultaService: CargaConsultaService,
  ) {}

  async executar(id: number): Promise<void> {
    const carga = await this.consultaService.buscarPorId(id);
    await this.repositorio.remove(carga);
  }
}
