import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class AtualizarTipoFrutaDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome não pode ser vazio' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  @IsOptional()
  nome?: string;
}
