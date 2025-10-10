import { Test, TestingModule } from '@nestjs/testing';
import { FrutasEmbalagensController } from './frutas-embalagens.controller';
import { FrutasEmbalagensService } from './frutas-embalagens.service';

describe('FrutasEmbalagensController', () => {
  let controller: FrutasEmbalagensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FrutasEmbalagensController],
      providers: [FrutasEmbalagensService],
    }).compile();

    controller = module.get<FrutasEmbalagensController>(
      FrutasEmbalagensController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
