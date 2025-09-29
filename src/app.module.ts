import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({ controllers: [], imports: [ConfigModule.forRoot()] })
export class AppModule {}
