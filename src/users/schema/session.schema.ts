import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import * as moment from "moment";

@Schema()
export class Sessions {
    @Prop({ type: String, default: null })
    user_id: string

    @Prop({ type: String, default: null })
    access_token: string

    // @Prop({ type: String, default: null })
    // fcm_token: string

    @Prop({ type: Number, default: moment().utc().valueOf() })
    created_at: number

    @Prop({ type: Number, default: null })
    updated_at: number

    @Prop({ default: false })
    is_deleted: boolean
}

export type SessionsDocument = HydratedDocument<Sessions>
export const SessionsModel = SchemaFactory.createForClass(Sessions)