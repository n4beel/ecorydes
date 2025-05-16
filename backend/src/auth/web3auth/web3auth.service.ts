import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { Web3AuthDto } from '../dto/auth.dto';

@Injectable()
export class Web3AuthService {

  constructor(
    private readonly configService: ConfigService
  ) { }

  verifyToken(authDto: Web3AuthDto): boolean {
    try {
      const { token } = authDto
      console.log("🚀 ~ file: web3auth.service.ts:16 ~ token:", token)
      const decoded = jwt.verify(token, this.configService.get('web3Auth.clientSecret'));
      // Perform additional checks if needed
      console.log("🚀 ~ file: web3auth.service.ts:15 ~ decoded:", decoded)
      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  }
}