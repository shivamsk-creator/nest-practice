import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { Users, UsersModel } from 'src/users/schema/user.schema';
import { AuthService } from './auth.service';
import { CommonService } from 'src/common/common.service';
import { Sessions, SessionsModel } from 'src/users/schema/session.schema';

@Module({
    imports: [
        CommonModule,
        MongooseModule.forFeature([
            { name: Users.name, schema: UsersModel },
            { name: Sessions.name, schema: SessionsModel },
        ]),
    ],
    providers: [AuthService, CommonService],
    controllers: [],
    exports: [AuthService],
})
export class AuthModule { }
