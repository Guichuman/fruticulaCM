import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CargaService } from './carga.service';
import { CreateCargaDto } from './dto/create-carga.dto';
import { UpdateCargaDto } from './dto/update-carga.dto';

@Controller('carga')
export class CargaController {
  constructor(private readonly cargaService: CargaService) {}

  @Post()
  create(@Body() createCargaDto: CreateCargaDto) {
    return this.cargaService.create(createCargaDto);
  }

  @Get()
  findAll() {
    return this.cargaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cargaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCargaDto: UpdateCargaDto) {
    return this.cargaService.update(+id, updateCargaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cargaService.remove(+id);
  }
}
