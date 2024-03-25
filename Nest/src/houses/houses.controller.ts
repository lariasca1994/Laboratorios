import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { HousesService } from './houses.service';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';

@Controller('houses')
export class HousesController {
  constructor(private readonly housesService: HousesService) {}

  @Get()
  getAllHouses() {
    return this.housesService.getAllHouses();
  }

  @Get(':id')
  getHouseById(@Param('id') id: string) {
    return this.housesService.getHouseById(+id);
  }

  @Post()
  createHouse(@Body() createHouseDto: CreateHouseDto) {
    return this.housesService.createHouse(createHouseDto);
  }

  @Put(':id')
  updateHouse(@Param('id') id: string, @Body() updateHouseDto: UpdateHouseDto) {
    return this.housesService.updateHouse(+id, updateHouseDto);
  }

  @Delete(':id')
  deleteHouse(@Param('id') id: string) {
    return this.housesService.deleteHouse(+id);
  }
}