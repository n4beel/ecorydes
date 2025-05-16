import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminModule } from 'src/admin/admin.module';
import { MailerService } from 'src/services/mailer/mailer.service';
import { AuthUtils } from './auth.utils';
import { Web3AuthService } from './web3auth/web3auth.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [AdminModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, AuthUtils, MailerService, Web3AuthService]
})
export class AuthModule { }
