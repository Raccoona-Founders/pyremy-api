import { prop, modelOptions } from '@typegoose/typegoose';
import { IsString, IsNumber, IsObject } from 'class-validator';
import { uuid } from 'uuidv4';

@modelOptions({
    schemaOptions: {
        autoIndex: true,
    },
})
export class OptimisationModel {
    @IsString()
    public readonly _id: number;

    @IsString()
    @prop({ required: true, default: () => uuid() })
    public readonly uuid: string;

    @IsObject()
    @prop({ default: () => ({}) })
    public metadata: Record<string, any>;

    @IsNumber()
    @prop({ required: true, default: () => Date.now() })
    public readonly createdTime: number;

    // @TODO Temporary response system
    public toResponse(): object {
        return {
            uuid: this.uuid,
            metadata: this.metadata,
            createdTime: this.createdTime,
        };
    }

    public setMetadata(metadata: Record<string, any>): void {
        this.metadata = Object.assign({}, this.metadata, metadata);
    }
}
