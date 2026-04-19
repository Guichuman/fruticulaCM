import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carga } from '../entities/carga.entity';
import { AtualizarCargaDto } from '../dto/atualizar-carga.dto';
import { CargaConsultaService } from '../carga-consulta.service';

@Injectable()
export class AtualizarCargaUseCase {
  constructor(
    @InjectRepository(Carga)
    private readonly repositorio: Repository<Carga>,
    private readonly consultaService: CargaConsultaService,
  ) {}

  async executar(id: number, dto: AtualizarCargaDto): Promise<Carga> {
    const carga = await this.repositorio.findOne({ where: { id } });
    if (!carga) {
      throw new NotFoundException(`Carga com ID ${id} não encontrada`);
    }

    if (dto.status !== undefined) carga.status = dto.status;
    if (dto.totalBlocos !== undefined) carga.totalBlocos = dto.totalBlocos;
    if (dto.maxCaixas !== undefined) carga.maxCaixas = dto.maxCaixas;

    await this.repositorio.save(carga);

    return this.consultaService.buscarPorId(id);
  }
}
