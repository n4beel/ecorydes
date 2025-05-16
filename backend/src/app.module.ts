import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import configuration from './common/config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from './admin/admin.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerService } from './services/mailer/mailer.service';
import { JwtModule } from '@nestjs/jwt';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { UserModule } from './user/user.module';
import { TransactionModule } from './transaction/transaction.module';
import { SettingsModule } from './settings/settings.module';
import { MediaModule } from './media/media.module';
import { OpenAIModule } from './openai/openai.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { RideRequestModule } from './ride-request/ride-request.module';
import { MoonpayModule } from './moonpay/moonpay.module';
import { WalletModule } from './wallet/wallet.module';
import { RoomsService } from './services/rooms/rooms.service';

//You can check all the options in Pusher.Options interface
const yourPusherOptions = {
  key: '284075912fc578cad16c',
  appId: '1992305',
  secret: 'f8932c613b2a6fe9e272',
  cluster: 'ap-2',
}

const chunkingOptions = {
  limit: 4000, //4mb
  enabled: true
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('database.uri')
      }),
      inject: [ConfigService]
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('email.host'),
          auth: {
            user: configService.get('email.user'),
            pass: configService.get('email.pass'),
          },
        },
        defaults: {
          from: '"CTV" <no-reply@CTV.org>'
        },
        template: {
          dir: process.cwd() + configService.get('email.templateDir'),
          adapter: new HandlebarsAdapter(), // or another adapter you prefer
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    AuthModule,
    AdminModule,
    UserModule,
    TransactionModule,
    SettingsModule,
    MediaModule,
    OpenAIModule,
    VehicleModule,
    RideRequestModule,
    MoonpayModule,
    WalletModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailerService, RoomsService],
})
export class AppModule { }
