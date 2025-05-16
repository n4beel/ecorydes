import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) { }

  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req, @Body() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.create(createVehicleDto, req.user.sub);
  }

  @Get()
  findAll() {
    return this.vehicleService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('owner')
  findAllByOwner(@Request() req) {
    return this.vehicleService.findAllByOwner(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehicleService.update(id, updateVehicleDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehicleService.remove(id);
  }
}
