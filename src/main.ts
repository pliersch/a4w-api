import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: console
  });

  let origin = 'http://localhost:4200';

  if (process.env.NODE_ENV === 'production') {
    origin = 'http://localhost:4300';
  }

  app.enableCors({credentials: true, origin: origin});
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
