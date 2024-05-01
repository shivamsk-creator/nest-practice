import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CommonService } from "src/common/common.service";
import { OtpDto, SignInDto } from "src/users/dto/create-user.dto";
import { Sessions } from "src/users/schema/session.schema";
import { Users } from "src/users/schema/user.schema";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Users.name) private model: Model<Users>,
        @InjectModel(Sessions.name) private session: Model<Sessions>,
        private common: CommonService,
        private jwtService: JwtService,
    ) { }

    async signIn(body: SignInDto) {
        try {
            let query = {
                $or: [
                    { email: body.email }
                ]
            }

            let user = await this.model.findOne(query)

            let payload = { id: user?._id, email: user?.email }
            if (!user) {
                throw new HttpException({ error_description: 'Invalid email', error_code: 'INVALID_EMAIL' }, HttpStatus.UNAUTHORIZED);
            }
            if ((user?.email !== null) && (user?.email == body.email) && (user?.is_email_verify == false)) {
                let mail = user?.email?.slice(0, 5)
                throw new HttpException({ error_description: `This email id is not verified.Please sign in with your previous email: ${mail}xxxxxx.com`, error_code: 'UNVERIFIED_EMAIL' }, HttpStatus.UNAUTHORIZED);
            }
            const isMatch = await this.common.bcriptPass(body.password, user?.password)

            if (!isMatch) {
                throw new HttpException({ error_description: 'Wrong password', error_code: 'WRONG_PASSWORD' }, HttpStatus.UNAUTHORIZED);
            }
            let access_token = await this.generateToken(payload)
            await this.createSession(user._id, access_token)
            user = await this.model.findOne({ _id: user?._id }, {
                name: 1, image: 1, email: 1, is_email_verify: 1, is_phone_verify: 1, country_code: 1, phone: 1, address: 1, description: 1, is_verified_user: 1, location: 1, temp_country_code: 1, temp_phone: 1, is_landlord: 1, date_of_change_pasword: 1
            }).lean(true)
            return { access_token, user }
        } catch (error) {
            throw error
        }
    }

    async generateToken(payload: any) {
        try {
            return await this.jwtService.signAsync(payload)
        } catch (error) {
            throw error
        }
    }

    async createSession(user_id: any, access_token: string) {
        try {
            return await this.session.create({
                user_id: user_id,
                access_token: access_token
            })
        } catch (error) {
            throw error
        }
    }

    async verifyEmail(body: OtpDto, id: string) {
        try {
            let user = await this.model.findById({ _id: new Types.ObjectId(id) })
            if (user?.email_otp != body.otp) {
                throw new HttpException({ error_description: 'Invalid OTP', error_code: 'INVALID_OTP' }, HttpStatus.BAD_REQUEST)
            }
            let data = {
                is_email_verify: true,
                email: user?.email,
                temp_mail: null,
                email_otp: null
            }
            await this.model.findOneAndUpdate(
                { _id: new Types.ObjectId(id) },
                data,
                { new: true }
            )
            let temp_destroy = await this.model.deleteMany({ email: user?.email, is_email_verify: false })
            if (temp_destroy) { throw new HttpException({ message: 'OTP verified' }, HttpStatus.OK) }
        } catch (error) {
            throw error
        }
    }

    async logOut(id: string, token: string) {
        try {
            await this.session.deleteMany({ user_id: id, access_token: token })
            throw new HttpException({ message: 'Log Out Successfully' }, HttpStatus.OK)
        } catch (error) {
            console.log(error);
            throw error
        }

    }


}