import { Test, TestingModule } from '@nestjs/testing';
import { FrutasEmbalagensService } from './frutas-embalagens.service';

describe('FrutasEmbalagensService', () => {
  let service: FrutasEmbalagensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FrutasEmbalagensService],
    }).compile();

    service = module.get<FrutasEmbalagensService>(FrutasEmbalagensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
