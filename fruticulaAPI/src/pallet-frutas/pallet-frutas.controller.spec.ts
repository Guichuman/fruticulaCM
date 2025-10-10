import { Test, TestingModule } from '@nestjs/testing';
import { PalletFrutasController } from './pallet-frutas.controller';
import { PalletFrutasService } from './pallet-frutas.service';

describe('PalletFrutasController', () => {
  let controller: PalletFrutasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PalletFrutasController],
      providers: [PalletFrutasService],
    }).compile();

    controller = module.get<PalletFrutasController>(PalletFrutasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
