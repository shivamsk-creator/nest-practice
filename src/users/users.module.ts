import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersModel } from './schema/user.schema';
import { Sessions, SessionsModel } from './schema/session.schema';
import { CommonService } from 'src/common/common.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UsersModel }, { name: Sessions.name, schema: SessionsModel }]),
    CommonModule
  ],
  controllers: [UsersController],
  providers: [UsersService, CommonService],
  exports: [UsersService]
})
export class UsersModule { }
