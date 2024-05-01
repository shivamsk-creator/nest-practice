import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";
import { LoginType } from "../role/user.role";

export class CreateUserDto {
    @IsNotEmpty()
    @ApiProperty({ required: true })
    name: string

    @IsNotEmpty()
    @ApiProperty({ required: true })
    country_code: string

    @IsNotEmpty()
    @ApiProperty({ required: true })
    phone: string

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ required: true })
    email: string

    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    })
    @ApiProperty({ required: true })
    password: string
}

export class SignInDto {

    @IsNotEmpty()
    @IsEmail({}, { message: 'Please enter a valid Email' })
    @ApiProperty()
    email: string

    @IsNotEmpty()
    @ApiProperty()
    password: string

    // @ApiProperty({ type: String, required: false })
    // fcm_token: string

    // @ApiProperty({ type: String, enum: DeviceType })
    // device_type: string
}

export class SocialSignInDto {
    @IsNotEmpty()
    @ApiProperty({ type: String })
    social_token: string

    @IsNotEmpty()
    @ApiProperty({ type: String, enum: LoginType, default: LoginType.google })
    social_type: string

    @ApiProperty({ type: String, required: false })
    fcm_token: string

    // @ApiProperty({ type: String, enum: DeviceType })
    // device_type: string
}

export class OtpDto {
    @IsNotEmpty()
    @ApiProperty()
    otp: number
}

export class PhoneOtpDto {
    @ApiProperty({ type: String, required: false })
    fcm_token: string

    @IsNotEmpty()
    @ApiProperty()
    otp: number
}

export class ForgetPassDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string
}


export class NewPassOtpDto {
    @IsNotEmpty()
    @ApiProperty()
    unique_id: string

    @IsNotEmpty()
    @ApiProperty()
    otp: number
}

export class ResendOtpDto {

    @ApiProperty({ required: false })
    email: string

}
