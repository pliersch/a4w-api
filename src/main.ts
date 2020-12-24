import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: console
  });
  app.enableCors({ credentials: true, origin: 'http://localhost:4200' });

  const options = new DocumentBuilder()
    .setTitle('a4w-api')
    .setDescription('Rest API description')
    .setVersion('1.0')
    .addTag('a4w')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
