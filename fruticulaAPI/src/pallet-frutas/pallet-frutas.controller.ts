import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PalletFrutasService } from './pallet-frutas.service';
import { CreatePalletFrutaDto } from './dto/create-pallet-fruta.dto';
import { UpdatePalletFrutaDto } from './dto/update-pallet-fruta.dto';

@Controller('pallet-frutas')
export class PalletFrutasController {
  constructor(private readonly palletFrutasService: PalletFrutasService) {}

  @Post()
  create(@Body() createPalletFrutaDto: CreatePalletFrutaDto) {
    return this.palletFrutasService.create(createPalletFrutaDto);
  }

  @Get()
  findAll() {
    return this.palletFrutasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.palletFrutasService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePalletFrutaDto: UpdatePalletFrutaDto,
  ) {
    return this.palletFrutasService.update(+id, updatePalletFrutaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.palletFrutasService.remove(+id);
  }
}
