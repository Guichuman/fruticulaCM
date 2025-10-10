import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FrutaService } from './fruta.service';
import { CreateFrutaDto } from './dto/create-fruta.dto';
import { UpdateFrutaDto } from './dto/update-fruta.dto';

@Controller('fruta')
export class FrutaController {
  constructor(private readonly frutaService: FrutaService) {}

  @Post()
  create(@Body() createFrutaDto: CreateFrutaDto) {
    return this.frutaService.create(createFrutaDto);
  }

  @Get()
  findAll() {
    return this.frutaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.frutaService.findOneWithEmbalagens(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFrutaDto: UpdateFrutaDto) {
    return this.frutaService.update(+id, updateFrutaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.frutaService.remove(+id);
  }
}
