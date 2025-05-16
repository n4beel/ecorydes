import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { InjectModel } from '@nestjs/mongoose';
import { defaultSettings, Settings } from 'src/entities/settings.schema';
import { Model } from 'mongoose';

@Injectable()
export class SettingsService {
  static settings: any; // Static variable to hold settings

  constructor(
    @InjectModel(Settings.name) private settingsModel: Model<Settings>,
  ) {
    this.initializeSettings();
  }

  async initializeSettings() {
    const settings = await this.find();
    if (!settings) {
      const newSettings = await this.create(defaultSettings);
      SettingsService.settings = newSettings; // Initialize static settings
    } else {
      SettingsService.settings = settings; // Load existing settings into static variable
    }
  }

  async create(createSettingDto: any) {
    const createdSettings = await this.settingsModel.create(createSettingDto);
    SettingsService.settings = createdSettings; // Update static settings
    return createdSettings;
  }

  async find() {
    return (await this.settingsModel.find().exec())[0];
  }

  // Update a settings entry
  async update(updateSettingsDto: UpdateSettingsDto): Promise<any> {
    const updatedSettings = await this.settingsModel.updateMany({}, updateSettingsDto, { new: true }).exec();
    if (!updatedSettings) {
      throw new NotFoundException(`Settings not found`);
    }

    // Update static settings with the new values
    const updatedData = await this.find();
    SettingsService.settings = updatedData;

    return updatedData;
  }
}
