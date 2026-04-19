import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Motorista } from '../entities/motorista.entity';
import { CriarMotoristaDto } from '../dto/criar-motorista.dto';
import { StatusMotoristaEnum } from 'src/compartilhado/enums/status-motorista.enum';

@Injectable()
export class CriarMotoristaUseCase {
  constructor(
    @InjectRepository(Motorista)
    private readonly repositorio: Repository<Motorista>,
  ) {}

  async executar(dto: CriarMotoristaDto): Promise<Motorista> {
    const motorista = this.repositorio.create({
      nome: dto.nome,
      telefone: dto.telefone,
      cpf: dto.cpf,
      status: StatusMotoristaEnum.ATIVO,
    });
    return this.repositorio.save(motorista);
  }
}
