import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PalletFruta } from '../entities/pallet-fruta.entity';
import { AtualizarPalletFrutaDto } from '../dto/atualizar-pallet-fruta.dto';
import { PalletFrutasConsultaService } from '../pallet-frutas-consulta.service';
import { QuantidadeVO } from 'src/compartilhado/value-objects/quantidade.vo';

@Injectable()
export class AtualizarPalletFrutaUseCase {
  constructor(
    @InjectRepository(PalletFruta)
    private readonly repositorio: Repository<PalletFruta>,
    private readonly consultaService: PalletFrutasConsultaService,
  ) {}

  async executar(id: number, dto: AtualizarPalletFrutaDto): Promise<PalletFruta> {
    const palletFruta = await this.consultaService.buscarPorId(id);

    if (dto.quantidadeCaixa !== undefined) {
      QuantidadeVO.criar(dto.quantidadeCaixa);
      palletFruta.quantidadeCaixa = dto.quantidadeCaixa;
    }

    await this.repositorio.save(palletFruta);
    return this.consultaService.buscarPorId(id);
  }
}
