import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema()
export class Users {
    @Prop({ type: String, default: null, trim: true })
    name: string

    @Prop({ type: String, default: null })
    email: string

    @Prop({ type: String, default: null })
    password: string

    @Prop({ type: String, default: null })
    country_code: string

    @Prop({ type: String, default: null })
    phone: string

    @Prop({ type: Boolean, default: false })
    is_email_verify: boolean

    @Prop({ default: false })
    is_phone_verify: boolean

    @Prop({ type: Number, default: null })
    email_otp: number

    @Prop({ type: Number, default: null })
    phone_otp: number
}

export type UsersDocument = HydratedDocument<Users>
export const UsersModel = SchemaFactory.createForClass(Users)