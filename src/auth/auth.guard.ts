import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { IS_PUBLIC_KEY } from "./auth.decorator";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Users } from "src/users/schema/user.schema";
import { Sessions } from "src/users/schema/session.schema";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @InjectModel(Users.name) private model: Model<Users>,
        @InjectModel(Sessions.name) private session: Model<Sessions>,
        private jwtService: JwtService, private reflector: Reflector,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException({ error_description: 'Unauthorized' });
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
            let session = await this.session.find({ user_id: payload.id })
            if (!session.length) {
                throw new ForbiddenException({ error_description: 'Session expired!! please signin again', error_code: 'SESSION_EXPIRED' });
            }
            request['user'] = payload;
        } catch (error) {
            throw error
        }

        // let user = await this.model.findOne({ _id: new Types.ObjectId(request.user.id) })
        // if (!user) {
        //     user = await this.model.athorities.findOne({ _id: new Types.ObjectId(request.user.id) })
        // }
        // if (user?.is_block == true) {
        //     throw new ForbiddenException({ error_description: user?.reason_for_block ?? 'You are blocked by administration from guard', error_code: 'BLOCKED' });
        // }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}