import { Test, TestingModule } from '@nestjs/testing';
import { HousesController } from './houses.controller';
import { HousesService } from './houses.service';

// Creamos una clase mock para simular el servicio
class MockHousesService {}

describe('HousesController', () => {
  let controller: HousesController;
  let service: MockHousesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HousesController],
      providers: [
        {
          provide: HousesService,
          useClass: MockHousesService,
        },
      ],
    }).compile();

    controller = module.get<HousesController>(HousesController);
    service = module.get<MockHousesService>(HousesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Agregamos una prueba adicional para un método del controlador
  describe('getAllHouses', () => {
    it('should return an array of houses', async () => {
      // Preparamos el mock del servicio para que devuelva un array de casas
      const mockHouses = [
        { id: 1, address: '123 Main St', rooms: 3 },
        { id: 2, address: '456 Oak Ave', rooms: 4 },
      ];
      jest.spyOn(service, 'getAllHouses').mockResolvedValue(mockHouses);

      // Llamamos al método del controlador y verificamos el resultado
      const result = await controller.getAllHouses();
      expect(result).toEqual(mockHouses);
    });
  });
});