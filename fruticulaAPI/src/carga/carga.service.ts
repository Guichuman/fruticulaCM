import {
  Body,
  Injectable,
  NotFoundException,
  Param,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carga } from './entities/carga.entity';
import { Caminhao } from 'src/caminhao/entities/caminhao.entity';
import { CreateCargaDto } from './dto/create-carga.dto';
import { UpdateCargaDto } from './dto/update-carga.dto';
import { Motorista } from 'src/motorista/entities/motorista.entity';
import { Pallet } from 'src/pallet/entities/pallet.entity';
import { PalletFruta } from 'src/pallet-frutas/entities/pallet-fruta.entity';
import { FrutasEmbalagem } from 'src/frutas-embalagens/entities/frutas-embalagen.entity';
import { Fruta } from 'src/fruta/entities/fruta.entity';
import { Embalagem } from 'src/embalagem/entities/embalagem.entity';

@Injectable()
export class CargaService {
  constructor(
    @InjectRepository(Carga)
    private readonly cargaRepository: Repository<Carga>,
    @InjectRepository(Caminhao)
    private readonly caminhaoRepository: Repository<Caminhao>,
    @InjectRepository(Motorista)
    private readonly motoristaRepository: Repository<Motorista>,
    @InjectRepository(Pallet)
    private readonly palletRepository: Repository<Pallet>,
    @InjectRepository(PalletFruta)
    private readonly palletFrutaRepository: Repository<PalletFruta>,
    @InjectRepository(FrutasEmbalagem)
    private readonly frutasEmbalagemRepository: Repository<FrutasEmbalagem>,
    @InjectRepository(Fruta)
    private readonly frutaRepository: Repository<Fruta>,
    @InjectRepository(Embalagem)
    private readonly embalagemRepository: Repository<Embalagem>,
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
    @Body() updateCargaDto: any,
  ) {
    const carga = await this.cargaRepository.findOne({ where: { id } });

    if (!carga) {
      throw new NotFoundException('Carga não encontrada');
    }

    // Atualizar dados básicos da carga
    if (updateCargaDto.status) {
      carga.status = updateCargaDto.status;
    }
    if (updateCargaDto.totalBlocos !== undefined) {
      carga.totalBlocos = updateCargaDto.totalBlocos;
    }
    if (updateCargaDto.maxCaixas !== undefined) {
      carga.maxCaixas = updateCargaDto.maxCaixas;
    }

    await this.cargaRepository.save(carga);

    // Se houver pallets no corpo da requisição, processar
    if (updateCargaDto.pallets && Array.isArray(updateCargaDto.pallets)) {
      // Remover pallets anteriores desta carga (se houver)
      const palletsAntigos = await this.palletRepository.find({
        where: { idCarga: id },
      });

      for (const palletAntigo of palletsAntigos) {
        // Remover frutas do pallet
        await this.palletFrutaRepository.delete({ idPallet: palletAntigo.id });
      }

      // Remover os pallets
      await this.palletRepository.delete({ idCarga: id });

      // Criar novos pallets
      for (const palletData of updateCargaDto.pallets) {
        // Criar o pallet
        const novoPallet = this.palletRepository.create({
          lado: palletData.lado,
          bloco: palletData.bloco,
          idCarga: id,
        });

        const palletSalvo = await this.palletRepository.save(novoPallet);

        // Processar as frutas do pallet
        if (palletData.frutas && Array.isArray(palletData.frutas)) {
          for (const frutaData of palletData.frutas) {
            // Buscar a fruta pelo nome
            const fruta = await this.frutaRepository.findOne({
              where: { nome: frutaData.name },
            });

            if (!fruta) {
              throw new BadRequestException(
                `Fruta '${frutaData.name}' não encontrada`,
              );
            }

            // Buscar a embalagem pelo nome
            const embalagem = await this.embalagemRepository.findOne({
              where: { nome: frutaData.packaging },
            });

            if (!embalagem) {
              throw new BadRequestException(
                `Embalagem '${frutaData.packaging}' não encontrada`,
              );
            }

            // Buscar a relação FrutasEmbalagem
            const frutasEmbalagem = await this.frutasEmbalagemRepository.findOne(
              {
                where: {
                  fruta: { id: fruta.id },
                  embalagem: { id: embalagem.id },
                },
              },
            );

            if (!frutasEmbalagem) {
              throw new BadRequestException(
                `Combinação de fruta '${frutaData.name}' com embalagem '${frutaData.packaging}' não encontrada`,
              );
            }

            // Criar o registro PalletFruta
            const palletFruta = this.palletFrutaRepository.create({
              quantidadeCaixa: frutaData.quantity,
              idPallet: palletSalvo.id,
              idFrutasEmbalagem: frutasEmbalagem.id,
            });

            await this.palletFrutaRepository.save(palletFruta);
          }
        }
      }
    }

    // Retornar a carga atualizada com os pallets
    return this.findOne(id);
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
