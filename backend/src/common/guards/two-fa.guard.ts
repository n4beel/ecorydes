import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AdminService } from 'src/admin/admin.service';

@Injectable()
export class TwoFactorGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private adminService: AdminService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('jwt.secret')
            });

            // Get user from database
            const user = await this.adminService.findOneById(payload.sub);
            if (!user) {
                throw new UnauthorizedException('Admin not found');
            }

            // If token is temporary, deny access to protected routes
            if (payload.temp) {
                throw new UnauthorizedException('2FA verification required');
            }

            // Attach user and payload to request
            request.user = payload;
            return true;
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}