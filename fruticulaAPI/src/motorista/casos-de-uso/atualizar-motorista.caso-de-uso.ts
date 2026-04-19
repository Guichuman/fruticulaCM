import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Motorista } from '../entities/motorista.entity';
import { AtualizarMotoristaDto } from '../dto/atualizar-motorista.dto';
import { MotoristaConsultaService } from '../motorista-consulta.service';

@Injectable()
export class AtualizarMotoristaUseCase {
  constructor(
    @InjectRepository(Motorista)
    private readonly repositorio: Repository<Motorista>,
    private readonly consultaService: MotoristaConsultaService,
  ) {}

  async executar(id: number, dto: AtualizarMotoristaDto): Promise<Motorista> {
    const motorista = await this.consultaService.buscarPorId(id);
    Object.assign(motorista, dto);
    return this.repositorio.save(motorista);
  }
}
