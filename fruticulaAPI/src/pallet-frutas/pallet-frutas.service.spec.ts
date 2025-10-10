import { Test, TestingModule } from '@nestjs/testing';
import { PalletFrutasService } from './pallet-frutas.service';

describe('PalletFrutasService', () => {
  let service: PalletFrutasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PalletFrutasService],
    }).compile();

    service = module.get<PalletFrutasService>(PalletFrutasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
