import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {NestExpressApplication} from "@nestjs/platform-express";
import cookieParser from 'cookie-parser';
// import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: "http://localhost:4200",
    credentials: true,
    allowedHeaders: "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  });
  app.useBodyParser('json');
  app.use(cookieParser());
  // app.useGlobalPipes(new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     transform: true,
  // }));
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
