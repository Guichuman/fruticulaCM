import { PartialType } from '@nestjs/mapped-types';
import { CreateEmbalagemDto } from './create-embalagem.dto';

export class UpdateEmbalagemDto extends PartialType(CreateEmbalagemDto) {}
