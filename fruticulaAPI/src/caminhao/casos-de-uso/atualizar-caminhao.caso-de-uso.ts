import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Caminhao } from '../entities/caminhao.entity';
import { Motorista } from 'src/motorista/entities/motorista.entity';
import { AtualizarCaminhaoDto } from '../dto/atualizar-caminhao.dto';
import { CaminhaoConsultaService } from '../caminhao-consulta.service';

@Injectable()
export class AtualizarCaminhaoUseCase {
  constructor(
    @InjectRepository(Caminhao)
    private readonly repositorio: Repository<Caminhao>,
    @InjectRepository(Motorista)
    private readonly motoristaRepositorio: Repository<Motorista>,
    private readonly consultaService: CaminhaoConsultaService,
  ) {}

  async executar(id: number, dto: AtualizarCaminhaoDto): Promise<Caminhao> {
    const caminhao = await this.consultaService.buscarPorId(id);

    if (dto.idMotorista) {
      const motorista = await this.motoristaRepositorio.findOneBy({ id: dto.idMotorista });
      if (!motorista) {
        throw new NotFoundException(`Motorista com ID ${dto.idMotorista} não encontrado`);
      }
      caminhao.motorista = motorista;
    }

    Object.assign(caminhao, {
      placa: dto.placa ?? caminhao.placa,
      modelo: dto.modelo ?? caminhao.modelo,
      qtdBlocos: dto.qtdBlocos ?? caminhao.qtdBlocos,
      status: dto.status ?? caminhao.status,
      palletBaixo: dto.palletBaixo ?? caminhao.palletBaixo,
    });

    return this.repositorio.save(caminhao);
  }
}
