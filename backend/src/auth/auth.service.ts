import { BadRequestException, ForbiddenException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { AuthDto, EmailDto, PasswordDto, SocialAuthDto, UpdatePassDto } from './dto/auth.dto';
import { MailerService } from 'src/services/mailer/mailer.service';
import { Role } from 'src/common/enums/role.enum';
import { Admin } from 'src/entities/admin.schema';
import { Status } from 'src/common/enums/status.enum';
import { AuthUtils } from './auth.utils';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { decryptData, encryptData } from 'src/common/helpers/cryptography';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { UserDocument } from 'src/entities/user.schema';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly adminService: AdminService,
        private readonly userService: UserService,
        private readonly mailerService: MailerService,
        private readonly authUtils: AuthUtils,
        private readonly configService: ConfigService
    ) {
        this.logger.verbose('AuthService initialized.');
    }

    login = async (authDto: AuthDto) => {
        // find admin
        const admin = await this.adminService.findOneByEmail(authDto.email);

        // verify password
        await this.authUtils.verifyPassword(authDto.password, admin?.password)

        // generate jwt token
        return await this.authUtils.generateAdminResponse(admin)
    }

    register = async (authDto: AuthDto) => {
        // hash password
        authDto.password = await this.authUtils.hashPassword(authDto.password)

        // add admin role and status
        const admin: Admin = {
            ...authDto,
            roles: [Role.admin],
            status: Status.accepted
        }

        // create admin
        const res = await this.adminService.createOne(admin);

        // generate jwt token
        return await this.authUtils.generateAdminResponse(res)
    }

    inviteAdmin = async (emailDto: EmailDto) => {
        // create admin
        const res = await this.adminService.createOne(emailDto);

        // generate jwt token
        const response = await this.authUtils.generateAdminResponse(res)

        // send email to admin
        this.mailerService.sendInvitationEmail(emailDto.email, response?.access_token)

        // send response
        return { message: "Invitation sent successfully." };
    }

    acceptInvite = async (email: string, passDto: PasswordDto) => {
        // check if invite exists
        const admin = await this.adminService.findOneByEmail(email);

        if (admin.status !== Status.invited) {
            throw new BadRequestException('Admin has not been invited.')
        }

        // hash password
        // update role and status
        const updatedAdmin: Admin = {
            email,
            password: await this.authUtils.hashPassword(passDto.password),
            roles: [Role.admin],
            status: Status.accepted
        }

        const res = await this.adminService.updateByEmail(email, updatedAdmin)

        // generate jwt token
        return await this.authUtils.generateAdminResponse(res)
    }

    updatePassword = async (email: string, updatePassDto: UpdatePassDto) => {
        // get admin
        const admin = await this.adminService.findOneByEmail(email);

        // verify password
        await this.authUtils.verifyPassword(updatePassDto.password, admin?.password)

        // check if new password exists in old passwords
        this.authUtils.isOldPassword(updatePassDto.newPassword, admin?.oldPasswords)

        // store old password
        const oldPasswords = [...admin.oldPasswords, admin?.password]

        // update password
        const updatedAdmin: Admin = {
            email,
            password: await this.authUtils.hashPassword(updatePassDto.newPassword),
            oldPasswords
        }

        const res = await this.adminService.updateByEmail(email, updatedAdmin)

        // generate jwt token
        return await this.authUtils.generateAdminResponse(res)
    }

    forgotPassword = async (emailDto: EmailDto) => {
        // check if admin exists
        const admin = await this.adminService.findOneByEmail(emailDto.email);

        // generate jwt token
        const res = await this.authUtils.generateAdminResponse(admin)

        // send email to admin
        this.mailerService.sendPasswordResetEmail(emailDto.email, res?.access_token)

        // send response
        return { message: "Recovery email sent successfully." };
    }

    resetPassword = async (email: string, passDto: PasswordDto) => {
        // get admin
        const admin = await this.adminService.findOneByEmail(email);

        // check if new password exists in old passwords
        this.authUtils.isOldPassword(passDto.password, admin?.oldPasswords)

        // store old password
        const oldPasswords = [...admin.oldPasswords, admin?.password]

        // update password
        const updatedAdmin: Admin = {
            email,
            password: await this.authUtils.hashPassword(passDto.password),
            oldPasswords
        }

        const res = await this.adminService.updateByEmail(email, updatedAdmin)

        // generate jwt token
        return await this.authUtils.generateAdminResponse(res)
    }

    // User login

    socialLogin = async (socialAuthDto: SocialAuthDto) => {
        // TODO: secure this with token verification from google

        const res = (await this.userService.create(socialAuthDto)) as UserDocument

        return await this.authUtils.generateUserResponse(res)
    }

    // 2FA Services

    async setup2FA(adminId: string, email: string): Promise<{ qrcodeUrl: string, secret: string, recoveryCodes: string[] }> {
        const admin = await this.adminService.findOneById(adminId);
        if (!admin) throw new Error('Admin not found');
        if (admin?.twoFactorEnabled) throw new BadRequestException('2FA Already enabled.')

        const { secret, qr_code } = await this.generateSecret(email);
        const recoveryCodes = this.authUtils.generateBackupCodes()

        admin.twoFactorSecret = encryptData(secret.base32, process.env.OTP_SECRET || '');
        admin.recoveryCodes = recoveryCodes.map(code => encryptData(code, process.env.OTP_SECRET || ''));
        await admin.save()

        return { qrcodeUrl: qr_code, secret: secret.base32, recoveryCodes };
    }

    async verify2FA(adminId: string, token: string): Promise<any> {
        const admin = await this.adminService.findOneById(adminId);
        if (!admin || !admin.twoFactorSecret) throw new ForbiddenException('Admin not found or no secret to verify');

        const secret = decryptData(admin.twoFactorSecret, process.env.OTP_SECRET || '')

        try {
            const verified = speakeasy.totp.verify({
                secret,
                encoding: 'base32',
                token: token,
            });
            if (verified) {
                admin.twoFactorEnabled = true;
                await admin.save()
            }
            else {
                throw new ForbiddenException(
                    'Provided two-factor authentication code is wrong or expired',
                );
            }

            return await this.authUtils.generateAdminResponse(admin, false)
        } catch (error) {
            console.log("error in verifying otp", error)
            throw new ForbiddenException(
                'Provided two-factor authentication code is wrong or expired',
            );
        }

    }

    async disable2FA(adminId: string, otpToken: string) {
        const admin = await this.adminService.findOneById(adminId);

        if (!admin || !admin.twoFactorSecret) throw new Error('Admin not found or no secret to verify');

        const secret = decryptData(admin.twoFactorSecret, process.env.OTP_SECRET || '')

        // Verify password and OTP before proceeding
        const otpVerified = speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token: otpToken,
        });

        if (otpVerified) {
            admin.recoveryCodes = undefined;
            admin.twoFactorEnabled = false;
            admin.twoFactorSecret = undefined; // Or however you want to mark it as disabled
            await admin.save()
            return { message: "2FA disabled successfully" };
        }

        throw new BadRequestException('Invalid OTP code')
    }

    async recoverAccount(adminId: string, recoveryCode: string): Promise<any> {
        const admin = await this.adminService.findOneById(adminId);

        if (!admin || !admin.recoveryCodes || admin.recoveryCodes.length <= 1) throw new Error('Admin not found or no recovery codes present');

        let isCodeValid: boolean = false
        let usedCode: string | undefined

        admin.recoveryCodes.forEach(code => {
            if (decryptData(code, process.env.OTP_SECRET || '') == recoveryCode) {
                isCodeValid = true
                usedCode = code
            }
        })

        if (isCodeValid) {
            // Invalidate the used recovery code
            admin.recoveryCodes = admin.recoveryCodes.filter(code => code !== usedCode);

            const { secret, qr_code } = await this.generateSecret(admin.email);
            admin.twoFactorSecret = encryptData(secret.base32, process.env.OTP_SECRET || '')
            await admin.save()

            return { message: 'Account recovery successful.', secret: secret.base32, qrcodeUrl: qr_code }
        }

        return { message: "Invalid recovery code." };
    }

    async generateSecret(email: string) {
        const projectName = this.configService.get('projectName')
        const secret = speakeasy.generateSecret({
            issuer: projectName,
            otpauth_url: true,
            name: `${projectName}:${email}`
        });

        const qr_code = await qrcode.toDataURL(secret.otpauth_url)

        return { secret, qr_code }
    }
}
