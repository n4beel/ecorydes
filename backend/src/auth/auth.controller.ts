import { Body, Controller, HttpCode, HttpStatus, Post, Put, Req, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, EmailDto, PasswordDto, SocialAuthDto, UpdatePassDto, Web3AuthDto } from './dto/auth.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { Web3AuthService } from './web3auth/web3auth.service';
import { TwoFactorGuard } from 'src/common/guards/two-fa.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly web3AuthService: Web3AuthService
    ) { }

    @Post('verify')
    async verify(@Body() authDto: Web3AuthDto) {
        return await this.web3AuthService.verifyToken(authDto);
    }

    @Post('register')
    async register(@Body() authDto: AuthDto) {
        return await this.authService.register(authDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() authDto: AuthDto) {
        return await this.authService.login(authDto);
    }

    @UseGuards(AuthGuard, TwoFactorGuard)
    @Post('invite')
    async invite(@Body() emailDto: EmailDto) {
        return await this.authService.inviteAdmin(emailDto);
    }

    @UseGuards(AuthGuard)
    @Post('accept')
    async accept(@Request() req, @Body() passDto: PasswordDto) {
        return await this.authService.acceptInvite(req.user.email, passDto);
    }

    @UseGuards(AuthGuard, TwoFactorGuard)
    @Put('password')
    async password(@Request() req, @Body() updatePassDto: UpdatePassDto) {
        return await this.authService.updatePassword(req.user.email, updatePassDto);
    }

    @Post('password/forgot')
    async forgotPassword(@Body() emailDto: EmailDto) {
        return await this.authService.forgotPassword(emailDto);
    }

    @UseGuards(AuthGuard)
    @Put('password/reset')
    async resetPassword(@Request() req, @Body() passDto: PasswordDto) {
        return await this.authService.resetPassword(req.user.email, passDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('social-login')
    async socialLogin(@Body() socialAuthDto: SocialAuthDto) {
        return await this.authService.socialLogin(socialAuthDto);
    }

    // 2FA Routes
    @UseGuards(AuthGuard)
    @Post('2fa/setup')
    @UseGuards(AuthGuard)
    async setupTwoFactorAuthentication(@Req() req) {
        const admin = req.user;

        const setup = await this.authService.setup2FA(admin.sub, admin.email);
        return { ...setup, message: 'Scan QR Code with Google Authenticator', };
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @Post('2fa/verify')
    @UseGuards(AuthGuard)
    async verifyTwoFactorAuthentication(@Body() body: any, @Req() req) {
        const { token } = body;
        const admin = req.user;
        const verified = await this.authService.verify2FA(admin.sub, token);
        return { ...verified, message: '2FA verification successful' };
    }

    @UseGuards(AuthGuard)
    @Post('2fa/disable')
    @UseGuards(AuthGuard)
    async disableTwoFactorAuthentication(@Body() body: any, @Req() req) {
        const admin = req.user;
        const { token } = body

        return await this.authService.disable2FA(admin.sub, token);
    }

    @UseGuards(AuthGuard)
    @Post('2fa/recover')
    @UseGuards(AuthGuard)
    async recoverAccount(@Body() body: any, @Req() req) {
        const { recoveryCode } = body;
        const admin = req.user;

        return await this.authService.recoverAccount(admin.sub, recoveryCode);
    }
}
