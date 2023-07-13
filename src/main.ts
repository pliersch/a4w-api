import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: console
  });

  const options = new DocumentBuilder()
    .setTitle('A4W')
    // .setDescription('The description')
    .setVersion('1.0')
    .addTag('a4w')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  let origin = 'http://localhost:4200';
  let port = 3000;

  if (process.env.NODE_ENV === 'production') {
    origin = 'http://127.0.0.1:4300';
    port = 3300;
  }

  console.log('ENV: ', process.env.NODE_ENV)
  console.log('origin: ', origin)
  console.log('port: ', port)

  app.enableCors({credentials: true, origin: origin});
  // app.useWebSocketAdapter(new A4WAdapter(app));
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
