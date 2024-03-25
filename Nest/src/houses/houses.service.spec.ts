import { Test, TestingModule } from '@nestjs/testing';
import { HousesService } from './houses.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { House } from './entities/house.entity';

// Creamos una clase mock para simular el repositorio TypeORM
export const mockRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('HousesService', () => {
  let service: HousesService;
  let repository: Repository<House>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HousesService,
        { provide: getRepositoryToken(House), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<HousesService>(HousesService);
    repository = module.get<Repository<House>>(getRepositoryToken(House));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Agregamos una prueba adicional para un método del servicio
  describe('getAllHouses', () => {
    it('should return an array of houses', async () => {
      // Preparamos el mock del repositorio para que devuelva un array de casas
      const mockHouses = [
        { id: 1, address: '123 Main St', rooms: 3 },
        { id: 2, address: '456 Oak Ave', rooms: 4 },
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(mockHouses);

      // Llamamos al método del servicio y verificamos el resultado
      const result = await service.getAllHouses();
      expect(result).toEqual(mockHouses);
    });
  });
});