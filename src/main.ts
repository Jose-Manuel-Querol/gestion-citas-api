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
    origin: [
      'http://localhost:4200',
      'http://127.0.0.1:4200',
      'https://gestion-citas-app-production.up.railway.app/',
      'https://gestion-citas-app-production.up.railway.app',
      'https://citaprevia.vitar.es/',
      'https://citaprevia.vitar.es',
    ],
    credentials: true,
  });
  //Swagger
  const config = new DocumentBuilder()
    .setTitle('Documentación de API Pública de Citas')
    .setDescription(
      'Esta documentación contendrá toda la información que necesitan para utilizar los endpoints de la  API Pública',
    )
    .setVersion('1.0')
    /*.addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'Token' },
      'apiToken',
    )*/
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
    include: [AppModule],
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });
  document.components.securitySchemes = {
    apiToken: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'Token',
    },
  };
  document.security = [{ apiToken: [] }];
  SwaggerModule.setup('docs', app, document);
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
