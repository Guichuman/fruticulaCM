import { Test, TestingModule } from '@nestjs/testing';
import { EmbalagemController } from './embalagem.controller';
import { EmbalagemService } from './embalagem.service';

describe('EmbalagemController', () => {
  let controller: EmbalagemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmbalagemController],
      providers: [EmbalagemService],
    }).compile();

    controller = module.get<EmbalagemController>(EmbalagemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
