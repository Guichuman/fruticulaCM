import { Test, TestingModule } from '@nestjs/testing';
import { EmbalagemService } from './embalagem.service';

describe('EmbalagemService', () => {
  let service: EmbalagemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmbalagemService],
    }).compile();

    service = module.get<EmbalagemService>(EmbalagemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
