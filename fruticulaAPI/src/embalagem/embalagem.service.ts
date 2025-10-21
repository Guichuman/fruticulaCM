import {
  Body,
  Injectable,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Embalagem } from './entities/embalagem.entity';
import { Repository } from 'typeorm';
import { CreateEmbalagemDto } from './dto/create-embalagem.dto';
import { UpdateEmbalagemDto } from './dto/update-embalagem.dto';

@Injectable()
export class EmbalagemService {
  constructor(
    @InjectRepository(Embalagem)
    private readonly embalagemRepository: Repository<Embalagem>,
  ) {}

  async create(@Body() createEmbalagem: CreateEmbalagemDto) {
    try {
      const dadosFruta = {
        nome: createEmbalagem.nome,
        frutaId: createEmbalagem.frutaId,
      };

      const novaEmbalagem = this.embalagemRepository.create(dadosFruta);

      await this.embalagemRepository.save(novaEmbalagem);

      return novaEmbalagem;
    } catch (error) {
      console.log('ERROR: ', error);
      throw new Error('Erro ao cadastrar embalagem');
    }
  }

  async findAll() {
    const embalagens = await this.embalagemRepository.find();

    if (!embalagens) {
      throw new NotFoundException('Embalagens não encontradas');
    }

    return embalagens;
  }

  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Embalagem> {
    const embalagem = await this.embalagemRepository.findOne({ where: { id } });

    if (!embalagem) {
      throw new NotFoundException('Embalagem não encontrada');
    }

    return embalagem;
  }

  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmbalagemDto: UpdateEmbalagemDto,
  ): Promise<Embalagem> {
    const dadosEmbalagem = {
      nome: updateEmbalagemDto.nome,
    };

    const embalagem = await this.embalagemRepository.preload({
      id,
      ...dadosEmbalagem,
    });

    if (!embalagem) {
      throw new NotFoundException('Embalagem não encontrada');
    }

    return this.embalagemRepository.save(embalagem);
  }

  async remove(@Param('id', ParseIntPipe) id: number) {
    const embalagem = await this.embalagemRepository.findOneBy({
      id,
    });

    if (!embalagem) {
      throw new NotFoundException('Embalagem não encontrada');
    }

    return await this.embalagemRepository.remove(embalagem);
  }
}
