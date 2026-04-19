import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Embalagem } from '../entities/embalagem.entity';
import { AtualizarEmbalagemDto } from '../dto/atualizar-embalagem.dto';
import { EmbalagemConsultaService } from '../embalagem-consulta.service';

@Injectable()
export class AtualizarEmbalagemUseCase {
  constructor(
    @InjectRepository(Embalagem)
    private readonly repositorio: Repository<Embalagem>,
    private readonly consultaService: EmbalagemConsultaService,
  ) {}

  async executar(id: number, dto: AtualizarEmbalagemDto): Promise<Embalagem> {
    const embalagem = await this.consultaService.buscarPorId(id);
    Object.assign(embalagem, dto);
    return this.repositorio.save(embalagem);
  }
}
