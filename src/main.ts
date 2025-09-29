import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.ts";

async function main() {
    const app = await NestFactory.create(AppModule);
    app.listen(process.env.PORT ?? 8080);
}
main();
