import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { OptimisationModel } from '../models';


@Injectable()
export class OptimisationService {
    public constructor(
        @InjectModel(OptimisationModel) private readonly optModel: ReturnModelType<typeof OptimisationModel>,
    ) {
    }

    public async getUserByEmail(email: string): Promise<OptimisationModel | undefined> {
        return await this.optModel.findOne({ email: email }).exec();
    }

    public async getUserByUUID(uuid: string): Promise<OptimisationModel | undefined> {
        return await this.optModel.findOne({ uuid: uuid }).exec();
    }

    public async isUserExists(email: string): Promise<boolean> {
        const user = await this.optModel.findOne({ email: email }).exec();

        return Boolean(user);
    }

    public async getAll(): Promise<OptimisationModel[]> {
        return (await this.optModel.find().exec()) as OptimisationModel[];
    }
}
