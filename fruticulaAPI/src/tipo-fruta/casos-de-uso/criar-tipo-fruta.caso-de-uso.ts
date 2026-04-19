import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoFruta } from '../entities/tipo-fruta.entity';
import { Fruta } from 'src/fruta/entities/fruta.entity';
import { CriarTipoFrutaDto } from '../dto/criar-tipo-fruta.dto';

@Injectable()
export class CriarTipoFrutaUseCase {
  constructor(
    @InjectRepository(TipoFruta)
    private readonly repositorio: Repository<TipoFruta>,
    @InjectRepository(Fruta)
    private readonly frutaRepositorio: Repository<Fruta>,
  ) {}

  async executar(dto: CriarTipoFrutaDto): Promise<TipoFruta> {
    const fruta = await this.frutaRepositorio.findOneBy({ id: dto.idFruta });
    if (!fruta) {
      throw new NotFoundException(`Fruta com ID ${dto.idFruta} não encontrada`);
    }

    const tipoFruta = this.repositorio.create({
      nome: dto.nome,
      idFruta: dto.idFruta,
    });

    return this.repositorio.save(tipoFruta);
  }
}
