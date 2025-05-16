import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Settings, SettingsSchema } from 'src/entities/settings.schema';
import { AdminService } from 'src/admin/admin.service';
import { Admin, AdminSchema } from 'src/entities/admin.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Settings.name, schema: SettingsSchema }]),
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),

  ],
  controllers: [SettingsController],
  providers: [SettingsService, AdminService],
})
export class SettingsModule { }
