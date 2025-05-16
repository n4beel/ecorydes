import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { RideRequestService } from './ride-request.service';
import { CreateRideRequestDto, LocationDto } from './dto/create-ride-request.dto';
import { UpdateRideRequestDto } from './dto/update-ride-request.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { BookRideDto } from './dto/book-ride.dto';
import { UpdateRideStatusByDriverDto, UpdateRideStatusByPassengerDto } from './dto/update-ride-status.dto';
import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { RateRideDto } from './dto/rate-ride.dto';

@Controller('ride-request')
export class RideRequestController {
  constructor(private readonly rideRequestService: RideRequestService) { }

  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req, @Body() createRideRequestDto: CreateRideRequestDto) {
    return this.rideRequestService.create(createRideRequestDto, req.user.sub);
  }

  @Get()
  findAll(@Query() paginatedDto: PaginatedDto) {
    return this.rideRequestService.findAll(paginatedDto);
  }

  @UseGuards(AuthGuard)
  @Get('driver')
  findAllByDriver(@Request() req, @Query() paginatedDto: PaginatedDto) {
    return this.rideRequestService.findAllByDriver(req.user.sub, paginatedDto);
  }

  @UseGuards(AuthGuard)
  @Get('driver/unclaimed')
  findAllByDriverUnclaimed(@Request() req) {
    return this.rideRequestService.findAllByDriverUnclaimed(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('passenger')
  findAllByPassenger(@Request() req, @Query() paginatedDto: PaginatedDto) {
    return this.rideRequestService.findAllByPassenger(req.user.sub, paginatedDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.rideRequestService.findOne(id, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch('book/:id')
  bookRide(@Request() req, @Param('id') id: string, @Body() bookRideDto: BookRideDto) {
    return this.rideRequestService.bookRide(req.user.sub, id, bookRideDto);
  }

  @UseGuards(AuthGuard)
  @Patch('status/:id')
  updateRideStatusByDriver(@Request() req, @Param('id') id: string, @Body() updateRideStatusDto: UpdateRideStatusByDriverDto) {
    return this.rideRequestService.updateRideStatusByDriver(req.user.sub, id, updateRideStatusDto);
  }

  @UseGuards(AuthGuard)
  @Patch('location/:id')
  updateDriverLocation(@Request() req, @Param('id') id: string, @Body() locationDto: { latitude: number, longitude: number }) {
    return this.rideRequestService.updateDriverLocation(req.user.sub, id, locationDto);
  }

  @UseGuards(AuthGuard)
  @Patch('status/passenger/:id')
  updateRideStatusByPassenger(@Request() req, @Param('id') id: string, @Body() updateRideStatusDto: UpdateRideStatusByPassengerDto) {
    return this.rideRequestService.updateRideStatusByPassenger(req.user.sub, id, updateRideStatusDto);
  }

  @UseGuards(AuthGuard)
  @Patch('rate/:id')
  addRideRating(@Request() req, @Param('id') id: string, @Body() rateRideDto: RateRideDto) {
    return this.rideRequestService.rateRide(req.user.sub, id, rateRideDto);
  }

  @UseGuards(AuthGuard)
  @Patch('collect-fare/:id')
  collectRideFare(@Request() req, @Param('id') id: string, @Body('walletAddress') walletAddress: string) {
    return this.rideRequestService.collectRideFare(req.user.sub, id, walletAddress);
  }

  @UseGuards(AuthGuard)
  @Patch('collect-credits/:id')
  collectRideCredits(@Request() req, @Param('id') id: string) {
    return this.rideRequestService.collectRideCredits(req.user.sub, id);
  }

  @Get('credits/:id')
  getRideCredits(@Param('id') id: string) {
    return this.rideRequestService.getRideCredits(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRideRequestDto: UpdateRideRequestDto) {
    return this.rideRequestService.update(id, updateRideRequestDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rideRequestService.remove(id);
  }
}
