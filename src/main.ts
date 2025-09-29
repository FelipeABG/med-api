import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.ts";
import { ValidationPipe } from "@nestjs/common";

async function main() {
    const app = await NestFactory.create(AppModule);
    // Validates data globally (for all routes) based on each handler DTOs.
    // Validation is made using class-validator and class-transform libraries.
    // Ensures data received in the handler to be as expected. If not as expected,
    // returns an error before even calling the handler.
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.listen(process.env.PORT ?? 8080);
}
main();
