import { PartialType } from '@nestjs/mapped-types';
import { CreateRideRequestDto } from './create-ride-request.dto';

export class UpdateRideRequestDto extends PartialType(CreateRideRequestDto) {}
