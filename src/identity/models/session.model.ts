import { prop, modelOptions } from '@typegoose/typegoose';
import { IsString, IsNumber, IsObject } from 'class-validator';

@modelOptions({
    schemaOptions: {
        autoIndex: true,
    },
})
export class SessionModel {
    @IsString()
    public readonly _id: number;

    @IsString()
    @prop({ required: true })
    public userId: string;

    @IsString()
    @prop({ required: true })
    public accessToken: string;

    @IsString()
    @prop({ required: true })
    public refreshToken: string;

    @IsNumber()
    @prop({ required: true })
    public expireIn: number;

    @IsNumber()
    @prop({ required: true })
    public refreshTokenExpireIn: number;

    @IsObject()
    @prop({ default: () => ({}) })
    public metadata: Record<string, any>;

    @IsNumber()
    @prop({ required: true, default: () => Date.now() })
    public readonly createdTime: number;
}
