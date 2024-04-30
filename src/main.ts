import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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
  //Swagger
  const config = new DocumentBuilder()
    .setTitle('Documentación de API Pública de Citas')
    .setDescription(
      'Esta documentación contendrá toda la información que necesitan para utilizar los endpoints de la  API Pública',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(3500, () => {
    console.log('Listening on port:3500');
  });
}
bootstrap();

process.on('uncaughtException', function (err) {
  console.error('Excepción detectada: ', err);
});
process.on('unhandledRejection', (error) => {
  console.error('Rechazo no controlado', error);
});
