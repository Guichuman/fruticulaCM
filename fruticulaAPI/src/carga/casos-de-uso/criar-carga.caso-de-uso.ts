import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carga } from '../entities/carga.entity';
import { Caminhao } from 'src/caminhao/entities/caminhao.entity';
import { Motorista } from 'src/motorista/entities/motorista.entity';
import { CriarCargaDto } from '../dto/criar-carga.dto';
import { StatusCargaEnum } from 'src/compartilhado/enums/status-carga.enum';

@Injectable()
export class CriarCargaUseCase {
  constructor(
    @InjectRepository(Carga)
    private readonly repositorio: Repository<Carga>,
    @InjectRepository(Caminhao)
    private readonly caminhaoRepositorio: Repository<Caminhao>,
    @InjectRepository(Motorista)
    private readonly motoristaRepositorio: Repository<Motorista>,
  ) {}

  async executar(dto: CriarCargaDto): Promise<Carga> {
    const caminhao = await this.caminhaoRepositorio.findOneBy({ id: dto.idCaminhao });
    if (!caminhao) {
      throw new NotFoundException(`Caminhão com ID ${dto.idCaminhao} não encontrado`);
    }

    const motorista = await this.motoristaRepositorio.findOneBy({ id: dto.idMotorista });
    if (!motorista) {
      throw new NotFoundException(`Motorista com ID ${dto.idMotorista} não encontrado`);
    }

    const carga = this.repositorio.create({
      totalBlocos: dto.totalBlocos,
      maxCaixas: dto.maxCaixas,
      status: StatusCargaEnum.CARREGANDO,
      caminhao,
      motorista,
    });

    return this.repositorio.save(carga);
  }
}
