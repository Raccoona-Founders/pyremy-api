import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { RedisModule } from 'nestjs-redis';
import { OptimisationModule } from './optimisation';
import { MainController } from './controllers';
import Config from './config';

@Module({
    imports: [
        TypegooseModule.forRoot(Config.MongoUrl, {
            user: Config.MongoUsername,
            pass: Config.MongoPassword,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }),
        RedisModule.forRootAsync({
            useFactory: () => ({
                url: Config.RedisURL,
            }),
        }),
        OptimisationModule,
    ],
    controllers: [MainController],
    providers: [OptimisationModule],
})
export class AppModule {
}
