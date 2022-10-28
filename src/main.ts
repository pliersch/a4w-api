import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: console
  });

  const options = new DocumentBuilder()
    .setTitle('A4W')
    // .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('a4w')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  let origin = 'http://localhost:4200';

  if (process.env.NODE_ENV === 'production') {
    origin = 'http://localhost:4300';
  }

  app.enableCors({credentials: true, origin: origin});
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
