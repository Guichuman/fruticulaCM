import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoFrutaEmbalagem } from '../entities/tipo-fruta-embalagem.entity';
import { TipoFrutaEmbalagemConsultaService } from '../tipo-fruta-embalagem-consulta.service';
import { AtualizarTipoFrutaEmbalagemDto } from '../dto/atualizar-tipo-fruta-embalagem.dto';

@Injectable()
export class AtualizarTipoFrutaEmbalagemUseCase {
  constructor(
    @InjectRepository(TipoFrutaEmbalagem)
    private readonly repositorio: Repository<TipoFrutaEmbalagem>,
    private readonly consultaService: TipoFrutaEmbalagemConsultaService,
  ) {}

  async executar(id: number, dto: AtualizarTipoFrutaEmbalagemDto): Promise<TipoFrutaEmbalagem> {
    const embalagem = await this.consultaService.buscarPorId(id);

    Object.assign(embalagem, {
      nome: dto.nome ?? embalagem.nome,
      sku: dto.sku ?? embalagem.sku,
    });

    return this.repositorio.save(embalagem);
  }
}
