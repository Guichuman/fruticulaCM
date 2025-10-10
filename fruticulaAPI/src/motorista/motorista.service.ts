import {
  Body,
  Injectable,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Motorista } from './entities/motorista.entity';
import { CreateMotoristaDto } from './dto/create-motorista.dto';
import { UpdateMotoristaDto } from './dto/update-motorista.dto';

@Injectable()
export class MotoristaService {
  constructor(
    @InjectRepository(Motorista)
    private readonly motoristaRepository: Repository<Motorista>,
  ) {}

  async create(@Body() createMotoristaDto: CreateMotoristaDto) {
    const dadosMotorista = {
      nome: createMotoristaDto.nome,
      telefone: createMotoristaDto.telefone,
      cpf: createMotoristaDto.cpf,
      status: 'ATIVO',
    };

    const novoMotorista = this.motoristaRepository.create(dadosMotorista);

    await this.motoristaRepository.save(novoMotorista);

    return novoMotorista;
  }

  async findAll() {
    const motoristas = await this.motoristaRepository.find();

    if (!motoristas) {
      throw new NotFoundException('Motoristas não encontrados');
    }

    return motoristas;
  }

  async findOne(@Param('id', ParseIntPipe) id: number) {
    const motorista = await this.motoristaRepository.findOne({ where: { id } });

    if (!motorista) {
      throw new NotFoundException('Motorista não encontrada');
    }

    return motorista;
  }

  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMotoristaDto: UpdateMotoristaDto,
  ) {
    const dadosMotorista = {
      nome: updateMotoristaDto.nome,
      telefone: updateMotoristaDto.telefone,
      cpf: updateMotoristaDto.cpf,
      status: updateMotoristaDto.status,
    };

    const motorista = await this.motoristaRepository.preload({
      id,
      ...dadosMotorista,
    });

    if (!motorista) {
      throw new NotFoundException('Motorista não encontrada');
    }

    return this.motoristaRepository.save(motorista);
  }

  async remove(@Param('id', ParseIntPipe) id: number) {
    const motorista = await this.motoristaRepository.findOneBy({
      id,
    });

    if (!motorista) {
      throw new NotFoundException('Motorista não encontrada');
    }

    return await this.motoristaRepository.remove(motorista);
  }
}
