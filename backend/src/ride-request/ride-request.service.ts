import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRideRequestDto, LocationDto } from './dto/create-ride-request.dto';
import { UpdateRideRequestDto } from './dto/update-ride-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LocationType, RideRequest } from 'src/entities/ride-request.schema';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { BookRideDto } from './dto/book-ride.dto';
import { UpdateRideStatusByDriverDto, UpdateRideStatusByPassengerDto } from './dto/update-ride-status.dto';
import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { RateRideDto } from './dto/rate-ride.dto';
import { UserService } from 'src/user/user.service';
import { WalletService } from 'src/wallet/wallet.service';
import { ConfigService } from '@nestjs/config';
import { RoomsService } from 'src/services/rooms/rooms.service';

@Injectable()
export class RideRequestService {
  constructor(
    @InjectModel(RideRequest.name) private rideRequestModel: Model<RideRequest>,
    private readonly vehicleService: VehicleService,
    private readonly userService: UserService,
    private readonly walletService: WalletService,
    private readonly configService: ConfigService,
    private readonly roomsService: RoomsService,
  ) { }

  async create(createRideRequestDto: CreateRideRequestDto, userId: string) {
    // Logic to create a new ride request

    // Check if the user has a vehicle
    const vehicleId = (await this.vehicleService.findAllByOwner(userId))[0]?._id;
    if (!vehicleId) {
      throw new BadRequestException('No vehicle found for the user');
    }

    let rideRequests

    const distance = this.calculateDistance(createRideRequestDto.startLocation, createRideRequestDto.endLocation);

    // TODO: handle recurring rides
    if (createRideRequestDto.isRecurring) {
      throw new BadRequestException('Recurring rides are not supported yet');
    }

    else {
      rideRequests = await this.rideRequestModel.create({
        userId: new Types.ObjectId(userId),
        vehicleId: new Types.ObjectId(vehicleId),
        distance,
        ...createRideRequestDto,
      })
    }
    // Create the ride request

    return rideRequests;
  }

  // Retrieve paginated user entries
  async findAll(paginatedDto: PaginatedDto): Promise<{
    data: RideRequest[],
    page: number,
    totalPages: number,
    total: number
  }> {
    const { page = 1, limit = 10 } = paginatedDto;  // Set default values if page/limit are not provided
    const skip = (page - 1) * limit;  // Calculate how many documents to skip

    const data = await this.rideRequestModel.find()
      .populate('vehicleId')  // Populate the vehicleId field with the Vehicle document
      .populate('userId')  // Populate the userId field with the User document
      .populate({
        path: 'passengers.passengerId',  // Populate the passengerId field with the User document
        model: 'User'  // Specify the model name if needed
      })
      .skip(skip)  // Skip the first (page - 1) * limit documents
      .limit(limit)  // Limit the number of documents returned
      .exec();

    const total = await this.rideRequestModel.countDocuments().exec();
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      page,
      totalPages,
      total
    };
  }

  async findAllByDriverUnclaimed(userId: string): Promise<{
    data: RideRequest[]
  }> {
    const data = await this.rideRequestModel.find({
      userId: new Types.ObjectId(userId),
      status: "completed",
      $or: [{ farePaid: false }, { creditsCollected: false }]
    })
      .populate('vehicleId')  // Populate the vehicleId field with the Vehicle document
      .populate('userId')  // Populate the userId field with the User document
      .populate({
        path: 'passengers.passengerId',  // Populate the passengerId field with the User document
        model: 'User'  // Specify the model name if needed
      })
      .exec();


    return {
      data
    };
  }

  async findAllByDriver(userId: string, paginatedDto: PaginatedDto): Promise<{
    data: RideRequest[],
    page: number,
    totalPages: number,
    total: number
  }> {
    const { page = 1, limit = 10 } = paginatedDto;  // Set default values if page/limit are not provided
    const skip = (page - 1) * limit;  // Calculate how many documents to skip

    const data = await this.rideRequestModel.find({ userId: new Types.ObjectId(userId), })
      .populate('vehicleId')  // Populate the vehicleId field with the Vehicle document
      .populate('userId')  // Populate the userId field with the User document
      .populate({
        path: 'passengers.passengerId',  // Populate the passengerId field with the User document
        model: 'User'  // Specify the model name if needed
      })
      .skip(skip)  // Skip the first (page - 1) * limit documents
      .limit(limit)  // Limit the number of documents returned
      .exec();

    const total = await this.rideRequestModel.countDocuments({ userId: new Types.ObjectId(userId) }).exec();
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      page,
      totalPages,
      total
    };
  }

  async findAllByPassenger(userId: string, paginatedDto: PaginatedDto): Promise<{
    data: RideRequest[],
    page: number,
    totalPages: number,
    total: number
  }> {
    const { page = 1, limit = 10 } = paginatedDto;  // Set default values if page/limit are not provided
    const skip = (page - 1) * limit;  // Calculate how many documents to skip

    const data = await this.rideRequestModel.find({ passengers: { $elemMatch: { passengerId: new Types.ObjectId(userId) } } })
      .populate('vehicleId')  // Populate the vehicleId field with the Vehicle document
      .populate('userId')  // Populate the userId field with the User document
      .populate({
        path: 'passengers.passengerId',  // Populate the passengerId field with the User document
        model: 'User'  // Specify the model name if needed
      })
      .skip(skip)  // Skip the first (page - 1) * limit documents
      .limit(limit)  // Limit the number of documents returned
      .exec();

    const total = await this.rideRequestModel.countDocuments({ userId: new Types.ObjectId(userId) }).exec();
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      page,
      totalPages,
      total
    };
  }

  async bookRide(userId: string, rideId: string, bookRideDto: BookRideDto) {
    // Logic to book a ride
    const rideRequest = await this.rideRequestModel.findById(rideId);
    if (!rideRequest) {
      throw new BadRequestException('Ride request not found');
    }

    // Check if the user is the owner of the ride request
    if (rideRequest.userId.toString() == userId) {
      throw new BadRequestException('You are the owner of this ride request');
    }

    // Check if the ride request is already booked
    if (rideRequest.seats <= rideRequest.occupied) {
      throw new BadRequestException('All the seats are already booked');
    }
    // Check if the user has already booked the ride
    const existingBooking = rideRequest.passengers.find((passenger) => passenger.passengerId.toString() === userId);
    if (existingBooking) {
      throw new BadRequestException('You have already booked this ride');
    }
    const userBalance = await this.walletService.getUserUsdcBalance(userId);
    const userLockedBalance = (await this.walletService.getUserWallet(userId))?.lockedBalance || 0;
    const userTotalBalance = userBalance - userLockedBalance;
    if (userTotalBalance < rideRequest.cost) {
      throw new BadRequestException('You do not have enough balance to book this ride');
    }

    // Update the ride request status to booked
    rideRequest.passengers.push({
      passengerId: new Types.ObjectId(userId),
      status: "pending",
      creditsCollected: false,
      ...bookRideDto,
    });

    rideRequest.occupied += 1;

    await rideRequest.save();
    await this.walletService.updateLockedBalance(userId, userLockedBalance + rideRequest.cost);

    return rideRequest;
  }

  async updateRideStatusByDriver(userId: string, rideId: string, updateRideStatusDto: UpdateRideStatusByDriverDto) {
    // Logic to update the ride status
    const rideRequest = await this.rideRequestModel.findById(rideId);
    if (!rideRequest) {
      throw new BadRequestException('Ride request not found');
    }

    const passengerStatus = rideRequest.passengers.map(passenger => passenger.status)
    const passengerFlags = rideRequest.passengers.map(passenger => passenger.status === "cancelled" ? true : passenger.trip1Completed)

    // Check if the user is the owner of the ride request
    if (rideRequest.userId.toString() != userId) {
      throw new BadRequestException('You are not the owner of this ride request');
    }

    switch (updateRideStatusDto.rideStatus) {
      case 'started':
        if (rideRequest.status !== 'pending') {
          throw new BadRequestException('Ride is not in pending status');
        }

        if (rideRequest.returnTrip && rideRequest.trip1Completed) {
          rideRequest.startedAt2 = new Date();
        }
        else {
          rideRequest.startedAt1 = new Date();
        }

        // await this.roomsService.createRoom(rideRequest._id.toString());

        break;
      case 'completed':
        if (rideRequest.status !== 'started') {
          throw new BadRequestException('Ride is not in progress');
        }
        if (rideRequest.trip1Completed && passengerStatus.some(status => status === 'pending' || status === 'picked')) {
          throw new BadRequestException('Some passengers have not been dropped yet');
        }
        if (!rideRequest.returnTrip && passengerStatus.some(status => status === 'pending' || status === 'picked')) {
          throw new BadRequestException('Some passengers have not been dropped yet');
        }
        if (rideRequest.returnTrip && rideRequest.trip1Completed) {
          rideRequest.endedAt2 = new Date();
          rideRequest.duration = this.calculateduration(rideRequest.startedAt1, rideRequest.endedAt1, rideRequest.startedAt2, rideRequest.endedAt2);
          rideRequest.co2Saved = this.calculateCo2Saved(rideRequest.distance, rideRequest.occupied);
        }
        if (!rideRequest.returnTrip) {
          rideRequest.endedAt1 = new Date();
          rideRequest.duration = this.calculateduration(rideRequest.startedAt1, rideRequest.endedAt1);
          rideRequest.co2Saved = this.calculateCo2Saved(rideRequest.distance, rideRequest.occupied);
        }
        if (rideRequest.returnTrip && !rideRequest.trip1Completed) {
          if (passengerFlags.some(flag => !flag)) {
            throw new BadRequestException('Some passengers have not been dropped yet');
          }
          updateRideStatusDto.rideStatus = "pending";
          rideRequest.trip1Completed = true;
        }

        break;
      case 'cancelled':
        if (rideRequest.status === 'completed') {
          throw new BadRequestException('Ride has already been completed');
        }
        if (rideRequest.status === 'started') {
          throw new BadRequestException('Ride has already been started');
        }
        break;
      default:
        throw new BadRequestException('Invalid ride status');
    }

    // Update the ride request status
    rideRequest.status = updateRideStatusDto.rideStatus;

    await rideRequest.save();

    return rideRequest;
  }

  async updateRideStatusByPassenger(userId: string, rideId: string, updateRideStatusDto: UpdateRideStatusByPassengerDto) {
    // Logic to update the ride status
    const rideRequest = await this.rideRequestModel.findById(rideId);
    if (!rideRequest) {
      throw new BadRequestException('Ride request not found');
    }

    const passenger = rideRequest.passengers.find((passenger) => passenger.passengerId.toString() === userId);
    if (!passenger) {
      throw new BadRequestException('This passenger is not booked on this ride');
    }
    console.log("🚀 ~ RideRequestService ~ updateRideStatusByPassenger ~ passenger.status:", passenger.status)

    switch (updateRideStatusDto.passengerStatus) {
      case 'picked':
        if (passenger.status !== 'pending') {
          throw new BadRequestException('Passenger is not in pending status');
        }
        break;
      case 'dropped':
        if (passenger.status !== 'picked') {
          throw new BadRequestException('Passenger is not in picked status');
        }
        if (rideRequest.returnTrip && !rideRequest.trip1Completed) {
          updateRideStatusDto.passengerStatus = "pending";
          passenger.trip1Completed = true;
        }
        break;
      case 'cancelled':
        if (passenger.status === 'dropped') {
          throw new BadRequestException('Passenger has already been dropped');
        }
        if (passenger.status === 'picked') {
          throw new BadRequestException('Passenger has already been picked');
        }
        break;
      default:
        throw new BadRequestException('Invalid passenger status');
    }

    // Update the passenger status
    passenger.status = updateRideStatusDto.passengerStatus;

    // Mark the passengers array as modified
    rideRequest.markModified('passengers');

    await rideRequest.save();

    return rideRequest;
  }

  async rateRide(userId: string, rideId: string, rateRideDto: RateRideDto) {
    // Logic to update the ride status
    const rideRequest = await this.rideRequestModel.findById(rideId);
    if (!rideRequest) {
      throw new BadRequestException('Ride request not found');
    }

    if (rideRequest.status !== 'completed') {
      throw new BadRequestException('Ride is not completed yet');
    }

    if (rateRideDto.ratingBy === 'passenger') {
      // check if the user is the passenger
      const passenger = rideRequest.passengers.find((passenger) => passenger.passengerId.toString() === userId);
      if (!passenger) {
        throw new BadRequestException('This user is not a passenger on this ride');
      }
      if (passenger.passengerRating) {
        throw new BadRequestException('This user has already rated this ride');
      }
      if (rateRideDto.rating < 1 || rateRideDto.rating > 5) {
        throw new BadRequestException('Rating must be between 1 and 5');
      }
      passenger.passengerRating = rateRideDto.rating;
    }
    else if (rateRideDto.ratingBy === 'driver') {
      // check if the user is the driver
      const passenger = rideRequest.passengers.find((passenger) => passenger.passengerId.toString() === rateRideDto.ratingTo);

      if (rideRequest.userId.toString() !== userId) {
        throw new BadRequestException('This user is not the driver of this ride');
      }
      if (passenger.driverRating) {
        throw new BadRequestException('This user has already rated this ride');
      }
      if (rateRideDto.rating < 1 || rateRideDto.rating > 5) {
        throw new BadRequestException('Rating must be between 1 and 5');
      }
      passenger.driverRating = rateRideDto.rating;
    }

    await rideRequest.save();

    // Update the driver status
    if (rateRideDto.ratingBy === 'passenger') {
      const driverRating = await this.getDriverRating(rateRideDto.ratingTo);
      await this.userService.update(rateRideDto.ratingTo, { rating: driverRating });
    }

    return rideRequest;
  }

  async collectRideFare(userId: string, rideId: string, walletAddress: string) {
    // Logic to collect the ride fare
    const rideRequest = await this.rideRequestModel.findById(rideId);
    if (!rideRequest) {
      throw new BadRequestException('Ride request not found');
    }

    if (rideRequest.farePaid) {
      throw new BadRequestException('Fare has already been collected');
    }

    if (rideRequest.status !== 'completed') {
      throw new BadRequestException('Ride is not completed yet');
    }

    if (rideRequest.userId.toString() !== userId) {
      throw new BadRequestException('This user is not the driver of this ride');
    }
    try {
      const passengers = rideRequest.passengers.map((passenger) => passenger.passengerId.toString());
      if (passengers.length === 0) {
        throw new BadRequestException('No passengers found for this ride');
      }

      // pass the passengers to the wallet service to collect the fare
      const collected = await this.walletService.collectFare(passengers, rideRequest.cost, walletAddress);
      if (!collected) {
        throw new BadRequestException('Error collecting fare');
      }

      // update the passengers locked balance
      passengers.forEach(async (passenger) => {
        const userLockedBalance = (await this.walletService.getUserWallet(passenger))?.lockedBalance || 0;
        await this.walletService.updateLockedBalance(passenger, userLockedBalance - rideRequest.cost);
      })

      rideRequest.farePaid = true;
      await rideRequest.save();

      return {
        message: 'Fare collected successfully',
        rideRequest,
        collected
      }

    } catch (error) {
      console.log("🚀 ~ RideRequestService ~ collectRideFare ~ error:", error)
      throw new BadRequestException('Error collecting fare');
    }
  }

  async collectRideCredits(userId: string, rideId: string) {
    // Logic to collect the ride fare
    const rideRequest = await this.rideRequestModel.findById(rideId);
    if (!rideRequest) {
      throw new BadRequestException('Ride request not found');
    }

    if (rideRequest.status !== 'completed') {
      throw new BadRequestException('Ride is not completed yet');
    }

    const isOwner = rideRequest.userId.toString() === userId;
    const isPassenger = rideRequest.passengers.some((passenger) => passenger.passengerId.toString() === userId);
    if (!isOwner && !isPassenger) {
      throw new BadRequestException('This user is not the driver or passenger of this ride');
    }

    if (isOwner && rideRequest.creditsCollected) {
      throw new BadRequestException('Credits have already been collected');
    }

    const passenger = rideRequest.passengers.find((passenger) => passenger.passengerId.toString() === userId);
    if (isPassenger && passenger.creditsCollected) {
      throw new BadRequestException('Credits have already been collected');
    }

    const credits = rideRequest.distance || 0 * this.configService.get('weightages.distance')
      + rideRequest.duration || 0 * this.configService.get('weightages.duration')
      + rideRequest.occupied || 0 + 1 * this.configService.get('weightages.occupancy')
      + rideRequest.cost || 0 * this.configService.get('weightages.fare')
      + rideRequest.co2Saved || 0 * this.configService.get('weightages.co2Saved');

    try {
      const collected = await this.walletService.collectCredits(userId, credits);
      if (!collected) {
        throw new BadRequestException('Error collecting credits');
      }

      // update the collected status here
      if (isOwner) {
        rideRequest.creditsCollected = true;
      }
      else if (isPassenger) {
        passenger.creditsCollected = true;
      }
      rideRequest.markModified('passengers');
      await rideRequest.save();

      return {
        message: 'Credits collected successfully',
        rideRequest,
        collected
      }
    } catch (error) {
      console.log("🚀 ~ RideRequestService ~ collectRideCredits ~ error:", error)
      throw new BadRequestException('Error collecting credits');
    }
  }

  async getRideCredits(rideId: string) {
    // Logic to collect the ride fare
    const rideRequest = await this.rideRequestModel.findById(rideId);
    if (!rideRequest) {
      throw new BadRequestException('Ride request not found');
    }

    const credits = (rideRequest.distance || 0) * this.configService.get('weightages.distance')
      + (rideRequest.duration || 0) * this.configService.get('weightages.duration')
      + (rideRequest.occupied || 0) + 1 * this.configService.get('weightages.occupancy')
      + (rideRequest.cost || 0) * this.configService.get('weightages.fare')
      + (rideRequest.co2Saved || 0) * this.configService.get('weightages.co2Saved');

    return {
      credits
    }
  }

  async findOne(id: string, userId: string = "") {
    // check if the user is the owner of the ride request, or passenger or none
    const rideRequest = await this.rideRequestModel.findById(id)
      .populate('vehicleId')  // Populate the vehicleId field with the Vehicle document
      .populate('userId')  // Populate the userId field with the User document
      .populate({
        path: 'passengers.passengerId',  // Populate the passengerId field with the User document
        model: 'User'  // Specify the model name if needed
      })
      .exec();

    return {
      rideRequest,
      isDriver: rideRequest.userId._id.toString() === userId,
      isPassenger: rideRequest.passengers.some((passenger) => passenger.passengerId._id.toString() === userId)
    }
  }

  update(id: string, updateRideRequestDto: UpdateRideRequestDto) {
    return this.rideRequestModel.findByIdAndUpdate(id, updateRideRequestDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.rideRequestModel.findByIdAndDelete(id).exec();
  }

  // TODO: handle driver rating issues
  async getDriverRating(userId: string): Promise<number> {
    console.log("🚀 ~ RideRequestService ~ getDriverRating ~ userId:", userId)

    const rideRequests = await this.rideRequestModel.find({ userId: new Types.ObjectId(userId) });
    if (rideRequests.length === 0) {
      throw new BadRequestException('No ride requests found for this user');
    }

    const totalPassengers = []

    rideRequests.forEach((rideRequest) => {
      totalPassengers.push(...rideRequest.passengers);
    });

    if (totalPassengers.length === 0) {
      console.log("No rating found for this user");
      return 0;
    }

    const totalRating = totalPassengers.reduce((acc, passenger) => {
      if (passenger.driverRating >= 1 && passenger.driverRating <= 5) {
        return acc + passenger.driverRating;
      }
      return acc;
    }, 0);

    return totalRating / rideRequests.length;
  }

  calculateDistance(startLocation: LocationType, endLocation: LocationType): number {
    const { latitude: startLat, longitude: startLong } = startLocation;
    const { latitude: endLat, longitude: endLong } = endLocation;

    const toRadians = (degrees: number) => degrees * (Math.PI / 180);

    const earthRadiusKm = 6371; // Radius of the Earth in kilometers

    const dLat = toRadians(endLat - startLat);
    const dLong = toRadians(endLong - startLong);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(startLat)) * Math.cos(toRadians(endLat)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c; // Distance in kilometers
  }

  calculateduration(startedAt1: Date, endedAt1: Date, startedAt2?: Date, endedAt2?: Date): number {
    const duration1 = startedAt1 && endedAt1 ? (endedAt1.getTime() - startedAt1.getTime()) / 60000 : 0; // in minutes
    const duration2 = startedAt2 && endedAt2 ? (endedAt2.getTime() - startedAt2.getTime()) / 60000 : 0; // in minutes
    return duration1 + duration2;
  }

  calculateCo2Saved(distance: number, passengers: number): number {
    const co2PerKm = 0.120; // kg of CO2 per km per passenger
    return distance * co2PerKm * passengers;
  }

  async updateDriverLocation(userId: string, rideId: string, location: { latitude: number, longitude: number }) {
    const PROXIMITY = 0.5; // 500 meters
    // Logic to update the ride status
    const rideRequest = await this.rideRequestModel.findById(rideId);
    if (!rideRequest) {
      throw new BadRequestException('Ride request not found');
    }

    // Check if the user is the owner of the ride request
    if (rideRequest.userId.toString() != userId) {
      throw new BadRequestException('You are not the owner of this ride request');
    }

    // Check if the ride is in progress
    if (rideRequest.status !== 'started') {
      throw new BadRequestException('Ride is not in progress');
    }

    console.log({
      channel: rideId,
      event: 'location',
      payload: location
    })

    // trigger location update event
    this.roomsService.sendMessage(rideId, 'location', location)

    // check if near any passenger pickup location or dropoff location
    const passengers = rideRequest.passengers.map((passenger) => ({
      passengerId: passenger.passengerId.toString(),
      pickupLocation: passenger.pickup,
      dropoffLocation: passenger.dropoff,
      status: passenger.status
    }));

    const nearPickup = passengers.filter((passenger) => {
      const distance = this.calculateDistance(location, passenger.pickupLocation);
      return distance <= PROXIMITY && passenger.status === "pending"
    });

    const nearDropoff = passengers.filter((passenger) => {
      const distance = this.calculateDistance(location, passenger.dropoffLocation);
      return distance <= PROXIMITY && passenger.status === "picked"
    });

    // if yes then send notification to passenger
    if (nearPickup.length > 0) {
      nearPickup.forEach((passenger) => {
        this.roomsService.sendMessage(
          rideId,
          'status',
          {
            message: 'Driver is near your pickup location',
            passenger: passenger.passengerId,
            nearPickup: true,
            nearDropoff: false
          });
      });
    }

    if (nearDropoff.length > 0) {
      nearDropoff.forEach((passenger) => {
        this.roomsService.sendMessage(
          rideId,
          'status',
          {
            message: 'Driver is near your dropoff location',
            passenger: passenger.passengerId,
            nearPickup: false,
            nearDropoff: true
          });
      });
    }

    return;

  }
}
