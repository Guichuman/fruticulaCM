import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fruta } from '../entities/fruta.entity';
import { CriarFrutaDto } from '../dto/criar-fruta.dto';

@Injectable()
export class CriarFrutaUseCase {
  constructor(
    @InjectRepository(Fruta)
    private readonly repositorio: Repository<Fruta>,
  ) {}

  async executar(dto: CriarFrutaDto): Promise<Fruta> {
    const fruta = this.repositorio.create({ nome: dto.nome });
    return this.repositorio.save(fruta);
  }
}
