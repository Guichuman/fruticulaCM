import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carga } from './entities/carga.entity';
import { StatusCargaEnum } from 'src/compartilhado/enums/status-carga.enum';

export interface ResumoCarga {
  id: number;
  criadoEm: Date;
  status: StatusCargaEnum;
  totalPallets: number;
  motorista: { nome: string } | null;
  caminhao: {
    placa: string;
    qtdBlocos: number;
    palletBaixo: string;
  };
}

export interface PaginaCarga {
  dados: ResumoCarga[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

@Injectable()
export class CargaConsultaService {
  constructor(
    @InjectRepository(Carga)
    private readonly repositorio: Repository<Carga>,
  ) {}

  async buscarTodos(
    pagina = 1,
    limite = 20,
    status?: StatusCargaEnum,
    dataInicio?: string,
    dataFim?: string,
  ): Promise<PaginaCarga> {
    const qb = this.repositorio
      .createQueryBuilder('carga')
      .select(['carga.id', 'carga.criadoEm', 'carga.status'])
      .leftJoin('carga.caminhao', 'caminhao')
      .addSelect(['caminhao.placa', 'caminhao.qtdBlocos', 'caminhao.palletBaixo'])
      .leftJoin('carga.motorista', 'motorista')
      .addSelect(['motorista.nome'])
      .loadRelationCountAndMap('carga.totalPallets', 'carga.pallets')
      .orderBy('carga.criadoEm', 'DESC')
      .skip((pagina - 1) * limite)
      .take(limite);

    if (status) {
      qb.andWhere('carga.status = :status', { status });
    }

    if (dataInicio && dataFim) {
      const fim = new Date(dataFim);
      fim.setDate(fim.getDate() + 1);
      qb.andWhere('carga.criadoEm BETWEEN :inicio AND :fim', {
        inicio: new Date(dataInicio),
        fim,
      });
    } else if (dataInicio) {
      qb.andWhere('carga.criadoEm >= :inicio', { inicio: new Date(dataInicio) });
    } else if (dataFim) {
      const fim = new Date(dataFim);
      fim.setDate(fim.getDate() + 1);
      qb.andWhere('carga.criadoEm < :fim', { fim });
    }

    const [dados, total] = await qb.getManyAndCount();

    return {
      dados: dados as unknown as ResumoCarga[],
      total,
      pagina,
      totalPaginas: Math.ceil(total / limite),
    };
  }

  async buscarPorId(id: number): Promise<Carga> {
    const carga = await this.repositorio.findOne({
      where: { id },
      relations: {
        caminhao: true,
        motorista: true,
        pallets: {
          palletFrutas: {
            tipoFrutaEmbalagem: { tipoFruta: { fruta: true } },
          },
        },
      },
    });
    if (!carga) {
      throw new NotFoundException(`Carga com ID ${id} não encontrada`);
    }
    return carga;
  }
}
