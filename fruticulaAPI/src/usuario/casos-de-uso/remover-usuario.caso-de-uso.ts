import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { UsuarioConsultaService } from '../usuario-consulta.service';

@Injectable()
export class RemoverUsuarioUseCase {
  constructor(
    @InjectRepository(Usuario)
    private readonly repositorio: Repository<Usuario>,
    private readonly consultaService: UsuarioConsultaService,
  ) {}

  async executar(id: number): Promise<void> {
    const usuario = await this.consultaService.buscarEntidadePorId(id);
    await this.repositorio.remove(usuario);
  }
}
