import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: console
  });

  let origin = 'http://localhost:4200';

  if (process.env.NODE_ENV === 'production') {
    origin = 'http://localhost:4300';
  }

  app.enableCors({credentials: true, origin: origin});

  const options = new DocumentBuilder()
    .setTitle('a4w-api')
    .setDescription('Rest API description')
    .setVersion('1.0')
    .addTag('a4w')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
