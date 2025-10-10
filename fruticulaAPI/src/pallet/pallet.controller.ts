import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PalletService } from './pallet.service';
import { CreatePalletDto } from './dto/create-pallet.dto';
import { UpdatePalletDto } from './dto/update-pallet.dto';

@Controller('pallet')
export class PalletController {
  constructor(private readonly palletService: PalletService) {}

  @Post()
  create(@Body() createPalletDto: CreatePalletDto) {
    return this.palletService.create(createPalletDto);
  }

  @Get()
  findAll() {
    return this.palletService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.palletService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePalletDto: UpdatePalletDto) {
    return this.palletService.update(+id, updatePalletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.palletService.remove(+id);
  }
}
