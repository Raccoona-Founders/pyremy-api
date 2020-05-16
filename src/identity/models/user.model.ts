import { prop, modelOptions } from '@typegoose/typegoose';
import { IsString, IsNumber, IsObject } from 'class-validator';
import { uuid } from 'uuidv4';

@modelOptions({
    schemaOptions: {
        autoIndex: true,
    },
})
export class UserModel {
    @IsString()
    public readonly _id: number;

    @IsString()
    @prop({ required: true, default: () => uuid() })
    public readonly uuid: string;

    @IsString()
    @prop({ required: true, unique: true })
    public readonly email: string;

    @IsString()
    @prop({ required: true })
    public password: string;

    @IsObject()
    @prop({ default: () => ({}) })
    public metadata: Record<string, any>;

    @IsNumber()
    @prop({ required: true, default: () => Date.now() })
    public readonly createdTime: number;

    // @TODO Temporary response system
    public toResponse(): object {
        return {
            email: this.email,
        };
    }

    public setMetadata(metadata: Record<string, any>): void {
        this.metadata = Object.assign({}, this.metadata, metadata);
    }
}
