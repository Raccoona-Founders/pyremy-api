export default class Config {
    public static readonly AppPort: number = process.env.PORT ? +process.env.PORT : 3000;
    public static readonly AppHost: string = process.env.HOST || 'localhost';

    public static readonly RedisURL: string = process.env.REDIS_URL || 'redis://redis:6379';
    public static readonly RedisPassword: string = process.env.REDIS_PASSWORD || undefined;

    public static readonly MongoUrl: string = process.env.MONGO_URL || 'mongodb://mongodb:27017';
    public static readonly MongoUsername: string = process.env.MONGO_USERNAME || 'raccoona';
    public static readonly MongoPassword: string = process.env.MONGO_PASSWORD || 'raccoona';

    public static readonly PyremyURL: string = process.env.PYREMY_URL || 'http://pyremy:80';
}
