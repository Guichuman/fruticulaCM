import {
  Body,
  Injectable,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Caminhao } from './entities/caminhao.entity';
import { CreateCaminhaoDto } from './dto/create-caminhao.dto';
import { UpdateCaminhaoDto } from './dto/update-caminhao.dto';
import { Motorista } from 'src/motorista/entities/motorista.entity';

@Injectable()
export class CaminhaoService {
  constructor(
    @InjectRepository(Caminhao)
    private readonly caminhaoRepository: Repository<Caminhao>,
    @InjectRepository(Motorista)
    private readonly motoristaRepository: Repository<Motorista>,
  ) {}

  async create(@Body() createCaminhaoDto: CreateCaminhaoDto) {
    const motorista = await this.motoristaRepository.findOneBy({
      id: createCaminhaoDto.motoristaId,
    });

    const dadosCaminhao = {
      placa: createCaminhaoDto.placa,
      status: 'ATIVO',
      qtdBlocos: createCaminhaoDto.qtdBlocos,
      motorista: motorista || undefined,
    };

    const novoCaminhao = this.caminhaoRepository.create(dadosCaminhao);

    await this.caminhaoRepository.save(novoCaminhao);

    return novoCaminhao;
  }

  async findAll() {
    const caminhoes = await this.caminhaoRepository.find({
      relations: {
        motorista: true,
      },
    });

    if (!caminhoes) {
      throw new NotFoundException('Caminhões não encontrados');
    }

    return caminhoes;
  }

  async findOne(@Param('id', ParseIntPipe) id: number) {
    const caminhao = await this.caminhaoRepository.findOne({
      where: { id },
      relations: {
        motorista: true,
      },
    });

    if (!caminhao) {
      throw new NotFoundException('Caminhão não encontrado');
    }

    return caminhao;
  }

  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCaminhaoDto: UpdateCaminhaoDto,
  ) {
    const dadosCaminhao = {
      placa: updateCaminhaoDto.placa,
      status: updateCaminhaoDto.status,
      qtdBlocos: updateCaminhaoDto.qtdBlocos,
      motorista: { id: updateCaminhaoDto?.motoristaId },
    };

    const caminhao = await this.caminhaoRepository.findOne({
      where: { id },
      relations: {
        motorista: true,
      },
    });

    if (!caminhao) {
      throw new NotFoundException('Caminhão não encontrada');
    }

    Object.assign(caminhao, dadosCaminhao);

    return this.caminhaoRepository.save(caminhao);
  }

  async remove(@Param('id', ParseIntPipe) id: number) {
    const caminhao = await this.caminhaoRepository.findOneBy({
      id,
    });

    if (!caminhao) {
      throw new NotFoundException('Caminhão não encontrada');
    }

    return await this.caminhaoRepository.remove(caminhao);
  }
}
