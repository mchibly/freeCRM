import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Security headers
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: config.get<string>('API_CORS_ORIGINS', 'http://localhost:3000').split(','),
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix(config.get<string>('API_PREFIX', 'api'));

  // API versioning
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // Validation pipe (DTO validation)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // OpenAPI / Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('freeCRM API')
    .setDescription('API REST do sistema freeCRM — gestão de leads, clientes, pipeline de vendas, produtos, serviços e pedidos.')
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Token JWT emitido pelo Keycloak',
    })
    .addTag('auth', 'Autenticação e sessão')
    .addTag('users', 'Gestão de usuários')
    .addTag('roles', 'RBAC — Perfis e permissões')
    .addTag('leads', 'Gestão de leads')
    .addTag('clients', 'Gestão de clientes')
    .addTag('services', 'Catálogo de serviços')
    .addTag('products', 'Catálogo de produtos')
    .addTag('orders', 'Gestão de pedidos')
    .addTag('pipeline', 'Pipeline de vendas')
    .addTag('health', 'Health checks')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = config.get<number>('API_PORT', 3001);
  await app.listen(port);
  console.log(`🚀 freeCRM API running on http://localhost:${port}`);
  console.log(`📖 Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
