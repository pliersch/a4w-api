import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as fs from "fs";
import { AppModule } from './app.module';

async function bootstrap() {

  const privateKey = fs.readFileSync('/etc/letsencrypt/live/apps4web.de/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/letsencrypt/live/apps4web.de/cert.pem', 'utf8');
  const ca = fs.readFileSync('/etc/letsencrypt/live/apps4web.de/chain.pem', 'utf8');

  const httpsOptions = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
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
    origin = 'https://apps4web.de';
    port = 3300;
  }

  console.log('ENV: ', process.env.NODE_ENV)
  console.log('origin: ', origin)
  console.log('port: ', port)

  app.enableCors({credentials: true, origin: origin});
  // app.useWebSocketAdapter(new A4WAdapter(app));
  await app.listen(3300, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
