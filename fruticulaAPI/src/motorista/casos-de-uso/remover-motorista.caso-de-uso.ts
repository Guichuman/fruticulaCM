import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Motorista } from '../entities/motorista.entity';
import { MotoristaConsultaService } from '../motorista-consulta.service';
import { Carga } from 'src/carga/entities/carga.entity';
import { PossuiCargasException } from 'src/compartilhado/exceptions/possui-cargas.exception';

@Injectable()
export class RemoverMotoristaUseCase {
  constructor(
    @InjectRepository(Motorista)
    private readonly repositorio: Repository<Motorista>,
    @InjectRepository(Carga)
    private readonly cargaRepositorio: Repository<Carga>,
    private readonly consultaService: MotoristaConsultaService,
  ) {}

  async executar(id: number): Promise<void> {
    const motorista = await this.consultaService.buscarPorId(id);

    const totalCargas = await this.cargaRepositorio.count({
      where: { idMotorista: id },
    });
    if (totalCargas > 0) {
      throw new PossuiCargasException('Motorista');
    }

    await this.repositorio.remove(motorista);
  }
}
