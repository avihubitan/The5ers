import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { EnvironmentVariables } from './config/env.validation';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService<EnvironmentVariables>);

    // Get validated environment variables
    const port = configService.get<number>('PORT', { infer: true });
    const nodeEnv = configService.get<string>('NODE_ENV', { infer: true });
    const corsOrigin = configService.get<string>('CORS_ORIGIN', { infer: true });
    const logLevel = configService.get<string>('LOG_LEVEL', { infer: true });

    // Enable CORS for frontend
    const corsOrigins = corsOrigin.split(',').map(origin => origin.trim());
    app.enableCors({
      origin: corsOrigins,
      credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    // Swagger documentation
    const config = new DocumentBuilder()
      .setTitle('Stock Management API')
      .setDescription('The Stock Management API description')
      .setVersion('1.0')
      .addTag('stocks')
      .addTag('portfolio')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(port);
    
    logger.log(`🚀 Application is running in ${nodeEnv} mode`);
    logger.log(`🌐 Server running on: http://localhost:${port}`);
    logger.log(`📚 Swagger documentation: http://localhost:${port}/api`);
    logger.log(`📊 Log level: ${logLevel}`);
    
  } catch (error) {
    logger.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();
