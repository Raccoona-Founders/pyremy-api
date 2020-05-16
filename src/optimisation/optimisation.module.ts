import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { RedisModule } from 'nestjs-redis';
import { OptimisationService, PyremyService } from './services';
import { OptimisationModel } from './models';

@Module({
    imports: [TypegooseModule.forFeature([OptimisationModel]), RedisModule],
    providers: [OptimisationService, OptimisationModel, PyremyService],
    exports: [OptimisationService, OptimisationModel, PyremyService],
})
export class OptimisationModule {
}
