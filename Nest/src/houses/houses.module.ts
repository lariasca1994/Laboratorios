import { Module } from '@nestjs/common';
import { HousesService } from './houses.service';
import { HousesController } from './houses.controller';

// Importamos los módulos necesarios para la persistencia de datos
// Por ejemplo, si usamos TypeORM con una base de datos PostgreSQL
import { TypeOrmModule } from '@nestjs/typeorm';
import { House } from './entities/house.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([House]), // Registramos la entidad House
  ],
  providers: [HousesService],
  controllers: [HousesController],
})
export class HousesModule {}