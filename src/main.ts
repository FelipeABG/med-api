import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";

async function main() {
    const app = await NestFactory.create(AppModule, { cors: true });
    // Validates data globally (for all routes) based on each handler DTOs.
    // Validation is made using class-validator and class-transform libraries.
    // Ensures data received in the handler to be as expected. If not as expected,
    // returns an error before even calling the handler.
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    // Getting the runtime variable for the server port
    const configService = app.get(ConfigService);
    const PORT = configService.get("PORT");

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
        .addTag(
            "User",
            "Edpoints related with user entity operations. (All user endpoints are accessible only to **administrators**).",
        )
        .build();

    // API documentation available on /docs
    const documentFactory = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("docs", app, documentFactory, { explorer: true });

    app.listen(PORT);
}
main();
