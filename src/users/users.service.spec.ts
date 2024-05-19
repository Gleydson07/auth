import { Test, TestingModule } from '@nestjs/testing';
import { faker } from "@faker-js/faker";
import { UsersService } from './users.service';
import { BlackListService } from "@/auth/black-list/black-list.service";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "@/database/Prisma/prisma.service";
import { RoleEnum } from "@prisma/client";

const handleGenarteUserEntity = (id?: number) => ({
  id: id || undefined,
  name: faker.person.firstName(),
  lastname: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  active: true,
  role: RoleEnum.USER as RoleEnum,
  createdAt: faker.date.past(),
  updatedAt: faker.date.past()
})

describe('UsersService', () => {
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let blackListService: BlackListService;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        PrismaService,
        JwtService,
        BlackListService
      ],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    blackListService = module.get<BlackListService>(BlackListService);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be create an user', async () => {
    const user1 = handleGenarteUserEntity(faker.number.int());
    const userCreated = handleGenarteUserEntity(faker.number.int());

    jest
    .spyOn(service, "findOneByEmail")
    .mockResolvedValueOnce(user1);

    jest
    .spyOn(service, "create")
    .mockResolvedValueOnce(user1);

    const result = await service.create(user1);
    console.log(result)
  });
});
