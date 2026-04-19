import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Caminhao } from '../entities/caminhao.entity';
import { CaminhaoConsultaService } from '../caminhao-consulta.service';
import { Carga } from 'src/carga/entities/carga.entity';
import { PossuiCargasException } from 'src/compartilhado/exceptions/possui-cargas.exception';

@Injectable()
export class RemoverCaminhaoUseCase {
  constructor(
    @InjectRepository(Caminhao)
    private readonly repositorio: Repository<Caminhao>,
    @InjectRepository(Carga)
    private readonly cargaRepositorio: Repository<Carga>,
    private readonly consultaService: CaminhaoConsultaService,
  ) {}

  async executar(id: number): Promise<void> {
    const caminhao = await this.consultaService.buscarPorId(id);

    const totalCargas = await this.cargaRepositorio.count({
      where: { idCaminhao: id },
    });
    if (totalCargas > 0) {
      throw new PossuiCargasException('Caminhão');
    }

    await this.repositorio.remove(caminhao);
  }
}
