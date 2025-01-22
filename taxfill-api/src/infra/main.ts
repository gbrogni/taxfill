import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('API docs')
    .setVersion('1.0')
    .addBearerAuth( 
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'access_token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const configService = app.get(EnvService);
  const port = configService.get('PORT');

  await app.listen(port);
}
bootstrap();