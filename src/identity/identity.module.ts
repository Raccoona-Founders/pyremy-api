import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { RedisModule } from 'nestjs-redis';
import { SessionService, IdentityService } from './services';
import { SessionModel, UserModel } from './models';

@Module({
    imports: [TypegooseModule.forFeature([UserModel, SessionModel]), RedisModule],
    providers: [IdentityService, SessionService],
    exports: [IdentityService, SessionService],
})
export class IdentityModule {}
