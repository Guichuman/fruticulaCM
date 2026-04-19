import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoFruta } from '../entities/tipo-fruta.entity';
import { TipoFrutaConsultaService } from '../tipo-fruta-consulta.service';
import { AtualizarTipoFrutaDto } from '../dto/atualizar-tipo-fruta.dto';

@Injectable()
export class AtualizarTipoFrutaUseCase {
  constructor(
    @InjectRepository(TipoFruta)
    private readonly repositorio: Repository<TipoFruta>,
    private readonly consultaService: TipoFrutaConsultaService,
  ) {}

  async executar(id: number, dto: AtualizarTipoFrutaDto): Promise<TipoFruta> {
    const tipoFruta = await this.consultaService.buscarPorId(id);
    tipoFruta.nome = dto.nome ?? tipoFruta.nome;
    return this.repositorio.save(tipoFruta);
  }
}
