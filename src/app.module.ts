import { Logger, Module } from "@nestjs/common";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { LoggerModule } from "./logger/logger.module";
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        String(process.env.NODE_ENV) === 'production'
          ? '.env'
          : '.env_local',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: (configService: ConfigService) => {
        const isDevelopment = (): boolean => String(process.env.NODE_ENV) === 'development';
        Logger.log({ 'NODE_ENV ': configService.get('NODE_ENV') })
        return {
          type: 'mongodb',
          url: configService.get('DB_URL'),
          ssl: !isDevelopment(),
          w: isDevelopment() ? null : 'majority',
          authSource: isDevelopment() ? null :  'admin',
          username: isDevelopment()
              ? null
              : configService.get('DB_USER'),
          password: isDevelopment()
              ? null
              : configService.get('DB_USER'),
          replicaSet: isDevelopment()
              ? null
              : 'TestCluster0-shard-0',
          database: configService.get('DB_NAME'),
          synchronize: isDevelopment(),
          useNewUrlParser: true,
          autoLoadEntities: true,
          namingStrategy: new SnakeNamingStrategy(),
          legacySpatialSupport: false,
          useUnifiedTopology: true,
          logging: isDevelopment() ? ['query', 'error'] : null,
        };
      },
      inject: [ConfigService],
    }),
    LoggerModule,
    AuthModule,
    UserModule,
    ProductModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
