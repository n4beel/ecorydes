import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { AdminDocument } from "src/entities/admin.schema";
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from "@nestjs/config";
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'
import { UserDocument } from "src/entities/user.schema";

@Injectable()
export class AuthUtils {

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    generateAdminResponse = async (admin: AdminDocument, temp: boolean = false, options?: JwtSignOptions): Promise<{
        access_token: string,
        email: string,
        twoFactorEnabled: boolean,
        id: string
    }> => {

        const { email, twoFactorEnabled, _id } = admin;

        // generate jwt token
        return {
            access_token: await this.generateAdminToken(admin, temp),
            email,
            twoFactorEnabled,
            id: _id.toString()
        };
    }

    generateUserResponse = async (user: UserDocument, options?: JwtSignOptions): Promise<{
        access_token: string,
        email: string,
        id: string,
        photo: string,
        givenName: string,
        familyName: string,
        name: string
    }> => {

        const { email, _id } = user;

        // generate jwt token
        return {
            access_token: await this.generateUserToken(user),
            email,
            id: _id.toString(),
            photo: user?.photo,
            givenName: user?.givenName,
            familyName: user?.familyName,
            name: user?.name
        };
    }

    generateAdminToken = async (admin: AdminDocument, temp: boolean, options?: JwtSignOptions): Promise<string> => {
        const payload = { sub: admin.id, email: admin.email, temp };
        return await this.jwtService.signAsync(payload, options)
    }

    generateUserToken = async (user: UserDocument): Promise<string> => {
        const payload = { sub: user.id, email: user.email };
        return await this.jwtService.signAsync(payload)
    }

    hashPassword = async (password: string): Promise<string> =>
        await bcrypt.hash(password, this.configService.get('salt'));

    verifyPassword = async (password: string, hashedPassword: string): Promise<void> => {
        const match = await bcrypt.compare(password, hashedPassword);

        if (!match) {
            throw new UnauthorizedException('Incorrect password');
        }
    }

    isOldPassword = (newPassword: string, oldHashes: string[]): void => {
        for (let oldHash of oldHashes) {
            if (bcrypt.compareSync(newPassword, oldHash)) {
                throw new BadRequestException('Cannot use an old password.')
            }
        }
    }

    generateBackupCodes = (count = 10, length = 8): string[] => {
        let codes: string[] = [];
        for (let i = 0; i < count; i++) {
            let code = crypto.randomBytes(length).toString('hex').slice(0, length).toUpperCase();
            // Ensuring uniqueness within the generated set
            if (!codes.includes(code)) {
                codes.push(code);
            } else {
                i--; // Regenerate this code if it's not unique
            }
        }
        return codes;
    }
}