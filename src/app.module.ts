import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { RedisModule } from 'nestjs-redis';
import { AuthService } from './services';
import { IdentityModule } from './identity/identity.module';
import { AuthController, InternalController, MainController } from './controllers';
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
                password: Config.RedisPassword,
            }),
        }),
        IdentityModule,
    ],
    controllers: [MainController, AuthController, InternalController],
    providers: [AuthService],
})
export class AppModule {
}
