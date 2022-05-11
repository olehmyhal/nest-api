import { Module } from "@nestjs/common";
import { UserModule } from "./auth/user.module";
import { TopPageModule } from "./top-page/top-page.module";
import { ProductModule } from "./product/product.module";
import { ReviewModule } from "./review/review.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypegooseModule } from "nestjs-typegoose";
import { getMongoConfig } from "./configs/mongo.config";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    UserModule,
    TopPageModule,
    ProductModule,
    ReviewModule,
  ],
})
export class AppModule {}
