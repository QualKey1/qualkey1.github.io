import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";

import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.use("/payment/webhook", bodyParser.raw({ type: "application/json" }));
  app.use(cookieParser());

  const configService = app.get(ConfigService);
  app.enableCors({
    origin: configService.get<string>("FRONTEND_URL"),
    credentials: true,
  });

  await app.listen(process.env.PORT || 3333);
}

bootstrap();
