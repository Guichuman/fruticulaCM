import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmbalagemService } from './embalagem.service';
import { CreateEmbalagemDto } from './dto/create-embalagem.dto';
import { UpdateEmbalagemDto } from './dto/update-embalagem.dto';

@Controller('embalagem')
export class EmbalagemController {
  constructor(private readonly embalagemService: EmbalagemService) {}

  @Post()
  create(@Body() createEmbalagemDto: CreateEmbalagemDto) {
    return this.embalagemService.create(createEmbalagemDto);
  }

  @Get()
  findAll() {
    return this.embalagemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.embalagemService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmbalagemDto: UpdateEmbalagemDto,
  ) {
    return this.embalagemService.update(+id, updateEmbalagemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.embalagemService.remove(+id);
  }
}
