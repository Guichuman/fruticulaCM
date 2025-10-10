import {
  Body,
  Injectable,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carga } from './entities/carga.entity';
import { Caminhao } from 'src/caminhao/entities/caminhao.entity';
import { CreateCargaDto } from './dto/create-carga.dto';
import { UpdateCargaDto } from './dto/update-carga.dto';
import { Motorista } from 'src/motorista/entities/motorista.entity';

@Injectable()
export class CargaService {
  constructor(
    @InjectRepository(Carga)
    private readonly cargaRepository: Repository<Carga>,
    @InjectRepository(Caminhao)
    private readonly caminhaoRepository: Repository<Caminhao>,
    @InjectRepository(Motorista)
    private readonly motoristaRepository: Repository<Motorista>,
  ) {}

  async create(@Body() createCargaDto: CreateCargaDto) {
    const caminhao = await this.caminhaoRepository.findOneBy({
      id: createCargaDto.idCaminhao,
    });

    if (!caminhao) {
      throw new NotFoundException('Caminhão não encontrado');
    }

    const motorista = await this.motoristaRepository.findOneBy({
      id: createCargaDto.idMotorista,
    });

    if (!motorista) {
      throw new NotFoundException('Motorista não encontrado');
    }

    const dadosCarga = {
      totalBlocos: createCargaDto.totalBlocos,
      status: 'ATIVO',
      maxCaixas: createCargaDto.maxCaixas,
      caminhao: caminhao,
      motorista: motorista,
    };

    const novaCarga = this.cargaRepository.create(dadosCarga);

    await this.cargaRepository.save(novaCarga);

    return novaCarga;
  }

  async findAll() {
    const cargas = await this.cargaRepository.find({
      relations: {
        caminhao: {
          motorista: true,
        },
      },
    });

    if (!cargas) {
      throw new NotFoundException('Cargas não encontradas');
    }

    return cargas;
  }

  async findOne(@Param('id', ParseIntPipe) id: number) {
    const carga = await this.cargaRepository.findOne({
      where: { id },
      relations: {
        caminhao: {
          motorista: true,
        },
      },
    });

    if (!carga) {
      throw new NotFoundException('Carga não encontrado');
    }

    return carga;
  }

  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCaminhaoDto: UpdateCargaDto,
  ) {
    const dadosCarga = {
      totalBlocos: updateCaminhaoDto.totalBlocos,
      status: updateCaminhaoDto.status,
      maxCaixas: updateCaminhaoDto.maxCaixas,
      idCaminhao: updateCaminhaoDto.idCaminhao,
    };

    const carga = await this.cargaRepository.preload({
      id,
      ...dadosCarga,
    });

    if (!carga) {
      throw new NotFoundException('Carga não encontrada');
    }

    return this.cargaRepository.save(carga);
  }

  async remove(@Param('id', ParseIntPipe) id: number) {
    const carga = await this.cargaRepository.findOneBy({
      id,
    });

    if (!carga) {
      throw new NotFoundException('Carga não encontrada');
    }

    return await this.cargaRepository.remove(carga);
  }
}
