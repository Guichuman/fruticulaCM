import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FrutasEmbalagensService } from './frutas-embalagens.service';
import { CreateFrutasEmbalagenDto } from './dto/create-frutas-embalagen.dto';
import { UpdateFrutasEmbalagenDto } from './dto/update-frutas-embalagen.dto';

@Controller('frutas-embalagens')
export class FrutasEmbalagensController {
  constructor(
    private readonly frutasEmbalagensService: FrutasEmbalagensService,
  ) {}

  @Post()
  create(@Body() createFrutasEmbalagenDto: CreateFrutasEmbalagenDto) {
    return this.frutasEmbalagensService.create(createFrutasEmbalagenDto);
  }

  @Get()
  findAll() {
    return this.frutasEmbalagensService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.frutasEmbalagensService.findEmbalagens(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFrutasEmbalagenDto: UpdateFrutasEmbalagenDto,
  ) {
    return this.frutasEmbalagensService.update(+id, updateFrutasEmbalagenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.frutasEmbalagensService.remove(+id);
  }
}
