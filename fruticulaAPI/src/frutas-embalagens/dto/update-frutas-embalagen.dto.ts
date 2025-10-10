import { PartialType } from '@nestjs/mapped-types';
import { CreateFrutasEmbalagenDto } from './create-frutas-embalagen.dto';

export class UpdateFrutasEmbalagenDto extends PartialType(
  CreateFrutasEmbalagenDto,
) {}
