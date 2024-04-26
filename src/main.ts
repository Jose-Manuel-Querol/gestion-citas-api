import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  app.setGlobalPrefix('api');
  app.use(helmet());
  app.enableCors({
    origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
    credentials: true,
  });
  await app.listen(3000, () => {
    console.log('Listening on port:3000');
  });
}
bootstrap();

process.on('uncaughtException', function (err) {
  console.error('Excepción detectada: ', err);
});
process.on('unhandledRejection', (error) => {
  console.error('Rechazo no controlado', error);
});
