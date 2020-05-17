import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { RedisModule } from 'nestjs-redis';
import { OptimisationService, PyremyService, KunaService } from './services';
import { OptimisationModel } from './models';

@Module({
    imports: [TypegooseModule.forFeature([OptimisationModel]), RedisModule],
    providers: [OptimisationService, OptimisationModel, PyremyService, KunaService],
    exports: [OptimisationService, OptimisationModel, PyremyService, KunaService],
})
export class OptimisationModule {
}
