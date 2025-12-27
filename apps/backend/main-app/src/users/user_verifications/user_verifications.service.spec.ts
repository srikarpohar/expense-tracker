import { Test, TestingModule } from '@nestjs/testing';
import { UserVerificationsService } from './user_verifications.service';

describe('UserVerificationsService', () => {
  let service: UserVerificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserVerificationsService],
    }).compile();

    service = module.get<UserVerificationsService>(UserVerificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
