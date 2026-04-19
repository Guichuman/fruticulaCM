import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoFrutaEmbalagem } from '../entities/tipo-fruta-embalagem.entity';
import { TipoFruta } from 'src/tipo-fruta/entities/tipo-fruta.entity';
import { CriarTipoFrutaEmbalagemDto } from '../dto/criar-tipo-fruta-embalagem.dto';

@Injectable()
export class CriarTipoFrutaEmbalagemUseCase {
  constructor(
    @InjectRepository(TipoFrutaEmbalagem)
    private readonly repositorio: Repository<TipoFrutaEmbalagem>,
    @InjectRepository(TipoFruta)
    private readonly tipoFrutaRepositorio: Repository<TipoFruta>,
  ) {}

  async executar(dto: CriarTipoFrutaEmbalagemDto): Promise<TipoFrutaEmbalagem> {
    const tipoFruta = await this.tipoFrutaRepositorio.findOneBy({ id: dto.idTipoFruta });
    if (!tipoFruta) {
      throw new NotFoundException(`Tipo de fruta com ID ${dto.idTipoFruta} não encontrado`);
    }

    const embalagem = this.repositorio.create({
      nome: dto.nome,
      sku: dto.sku,
      idTipoFruta: dto.idTipoFruta,
    });

    return this.repositorio.save(embalagem);
  }
}
