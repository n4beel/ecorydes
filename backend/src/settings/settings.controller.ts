import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { TwoFactorGuard } from 'src/common/guards/two-fa.guard';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) { }

  @UseGuards(AuthGuard, TwoFactorGuard)
  @Get()
  find() {
    return this.settingsService.find();
  }

  @UseGuards(AuthGuard, TwoFactorGuard)
  @Patch()
  update(@Body() updateSettingDto: UpdateSettingsDto) {
    return this.settingsService.update(updateSettingDto);
  }
}
