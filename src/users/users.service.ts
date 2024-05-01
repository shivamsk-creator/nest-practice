import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from './schema/user.schema';
import moment from 'moment';
import { JwtService } from '@nestjs/jwt';
import { Sessions } from './schema/session.schema';
import { CommonService } from '../common/common.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private model: Model<Users>,
    @InjectModel(Sessions.name) private session: Model<Sessions>,
    // private jwtService: JwtService,
    private common: CommonService,
    private jwtService: JwtService,


  ) { }

  async signUp(body: CreateUserDto) {
    try {

      let existMail = await this.model.findOne({ email: body.email, })
      let existPhone = await this.model.findOne({ country_code: body.country_code, phone: body.phone })
      if (existMail) {
        throw new HttpException({ error_description: "This email is already exist! Please use another email address", error_code: 'EMAIL_ALREADY_EXIST' }, HttpStatus.BAD_REQUEST);
      }
      if (existPhone) {
        throw new HttpException({ error_description: "This phone no. is already exist! Please use another phone no.", error_code: 'PHONE_ALREADY_EXIST' }, HttpStatus.BAD_REQUEST);
      }
      console.log("hello");

      let otp = await this.common.generateOtp()
      let hash = await this.common.encriptPass(body.password)

      let data = {
        name: body.name,
        email: body.email,
        password: hash,
        email_otp: otp,
        phone_otp: 1234,
      }
      let user = await this.model.create(data)

      try {
        await this.common.verification(user.email, otp, user?.name)
      } catch (error) {
        throw new HttpException({ error_description: "This email may not exist", error_code: 'EMAIL_NOT_EXIST' }, HttpStatus.BAD_REQUEST)
      }

      let payload = { id: user._id, email: user.email }
      let access_token = await this.jwtService.signAsync(payload)
      await this.session.create({
        user_id: user?._id,
        access_token: access_token,
      })
      return { access_token }
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
