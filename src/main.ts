import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.ts";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function main() {
    const app = await NestFactory.create(AppModule);
    // Validates data globally (for all routes) based on each handler DTOs.
    // Validation is made using class-validator and class-transform libraries.
    // Ensures data received in the handler to be as expected. If not as expected,
    // returns an error before even calling the handler.
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    const swaggerConfig = new DocumentBuilder()
        .setTitle("Medicine API")
        .setDescription("API for the medicines APP")
        .setVersion("1.0")
        .addGlobalResponse({
            status: 500,
            description: "Internal server error.",
        })
        .addTag(
            "Auth",
            "Endpoints used for user registration and authentication.",
        )
        .build();

    const documentFactory = SwaggerModule.createDocument(app, swaggerConfig);
    // API documentation available on /docs
    SwaggerModule.setup("docs", app, documentFactory);
    app.listen(process.env.PORT ?? 8080);
}
main();
