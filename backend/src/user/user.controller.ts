import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { Request } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AddIdDto } from './dto/add-id.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(@Query() paginatedDto: PaginatedDto) {
    return this.userService.findAll(paginatedDto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getLoggedInUser(@Request() req) {
    return this.userService.getLoggedInUser(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('balance')
  getUserBalance(@Request() req) {
    return this.userService.getUserBalance(req.user.sub);
  }

  // @UseGuards(AuthGuard)
  // @Get('wallet')
  // getUserWallet(@Request() req) {
  //   return this.userService.getUserWallet(req.user.sub);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(id);
  // }

  @UseGuards(AuthGuard)
  @Patch('id')
  addIdentityDocument(@Request() req, @Body() addIdDto: AddIdDto) {
    return this.userService.addIdentityDocument(req.user.sub, addIdDto);
  }

  @UseGuards(AuthGuard)
  @Patch()
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.sub, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete()
  remove(@Request() req) {
    return this.userService.remove(req.user.sub);
  }

}
