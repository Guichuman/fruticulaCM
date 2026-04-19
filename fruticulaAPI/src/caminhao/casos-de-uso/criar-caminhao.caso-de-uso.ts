import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Caminhao } from '../entities/caminhao.entity';
import { Motorista } from 'src/motorista/entities/motorista.entity';
import { CriarCaminhaoDto } from '../dto/criar-caminhao.dto';
import { StatusCaminhaoEnum } from 'src/compartilhado/enums/status-caminhao.enum';

@Injectable()
export class CriarCaminhaoUseCase {
  constructor(
    @InjectRepository(Caminhao)
    private readonly repositorio: Repository<Caminhao>,
    @InjectRepository(Motorista)
    private readonly motoristaRepositorio: Repository<Motorista>,
  ) {}

  async executar(dto: CriarCaminhaoDto): Promise<Caminhao> {
    let motorista: Motorista | null = null;
    if (dto.idMotorista) {
      motorista = await this.motoristaRepositorio.findOneBy({ id: dto.idMotorista });
      if (!motorista) {
        throw new NotFoundException(`Motorista com ID ${dto.idMotorista} não encontrado`);
      }
    }

    const caminhao = this.repositorio.create({
      placa: dto.placa,
      modelo: dto.modelo,
      qtdBlocos: dto.qtdBlocos,
      status: StatusCaminhaoEnum.ATIVO,
      palletBaixo: dto.palletBaixo ?? 'N',
      motorista: motorista ?? undefined,
    });

    return this.repositorio.save(caminhao);
  }
}
