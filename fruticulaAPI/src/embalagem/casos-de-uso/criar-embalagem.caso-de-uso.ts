import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Embalagem } from '../entities/embalagem.entity';
import { CriarEmbalagemDto } from '../dto/criar-embalagem.dto';

@Injectable()
export class CriarEmbalagemUseCase {
  constructor(
    @InjectRepository(Embalagem)
    private readonly repositorio: Repository<Embalagem>,
  ) {}

  async executar(dto: CriarEmbalagemDto): Promise<Embalagem> {
    const embalagem = this.repositorio.create({ nome: dto.nome });
    return this.repositorio.save(embalagem);
  }
}
