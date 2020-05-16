import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { PasswordHelper } from '../../utils';
import { RegisterUserDto } from '../../dto';
import { UserModel } from '../models';


@Injectable()
export class IdentityService {
    public constructor(
        @InjectModel(UserModel) private readonly userModel: ReturnModelType<typeof UserModel>,
    ) {
    }

    public async getUserByEmail(email: string): Promise<UserModel | undefined> {
        return await this.userModel.findOne({ email: email }).exec();
    }

    public async getUserByUUID(uuid: string): Promise<UserModel | undefined> {
        return await this.userModel.findOne({ uuid: uuid }).exec();
    }

    public async isUserExists(email: string): Promise<boolean> {
        const user = await this.userModel.findOne({ email: email }).exec();

        return Boolean(user);
    }

    public async registerUser(registerUserDTO: RegisterUserDto): Promise<UserModel> {
        const newUser = this.userModel.create({
            email: registerUserDTO.email,
            password: await PasswordHelper.hashPassword(registerUserDTO.password),
        });

        return newUser;
    }

    public async getAll(): Promise<UserModel[]> {
        return (await this.userModel.find().exec()) as UserModel[];
    }
}
