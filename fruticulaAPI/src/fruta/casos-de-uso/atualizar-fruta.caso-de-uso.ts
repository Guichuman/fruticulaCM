import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fruta } from '../entities/fruta.entity';
import { AtualizarFrutaDto } from '../dto/atualizar-fruta.dto';
import { FrutaConsultaService } from '../fruta-consulta.service';

@Injectable()
export class AtualizarFrutaUseCase {
  constructor(
    @InjectRepository(Fruta)
    private readonly repositorio: Repository<Fruta>,
    private readonly consultaService: FrutaConsultaService,
  ) {}

  async executar(id: number, dto: AtualizarFrutaDto): Promise<Fruta> {
    const fruta = await this.consultaService.buscarPorId(id);
    Object.assign(fruta, dto);
    return this.repositorio.save(fruta);
  }
}
