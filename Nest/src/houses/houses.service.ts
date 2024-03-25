import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { House } from './entities/house.entity';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';

@Injectable()
export class HousesService {
  constructor(
    @InjectRepository(House)
    private readonly houseRepository: Repository<House>,
  ) {}

  async getAllHouses(): Promise<House[]> {
    return this.houseRepository.find();
  }

  async getHouseById(id: number): Promise<House> {
    return this.houseRepository.findOne({ where: { id } });
  }

  async createHouse(createHouseDto: CreateHouseDto): Promise<House> {
    const house = this.houseRepository.create(createHouseDto);
    return this.houseRepository.save(house);
  }

  async updateHouse(id: number, updateHouseDto: UpdateHouseDto): Promise<House> {
    const house = await this.houseRepository.findOne({ where: { id } });
    if (!house) {
      // Manejo de error si no se encuentra la casa
      throw new Error(`House with id ${id} not found`);
    }
    Object.assign(house, updateHouseDto);
    return this.houseRepository.save(house);
  }

  async deleteHouse(id: number): Promise<void> {
    const house = await this.houseRepository.findOne({ where: { id } });
    if (!house) {
      // Manejo de error si no se encuentra la casa
      throw new Error(`House with id ${id} not found`);
    }
    await this.houseRepository.remove(house);
  }
}