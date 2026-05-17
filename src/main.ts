import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllTypeConfig } from './common/config/config.type';
import { setupSwagger } from './common/swagger/swagger.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Swagger:
  setupSwagger(app);

  const configService = app.get(ConfigService<AllTypeConfig>);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await app.listen(
    configService.getOrThrow('app.port', { infer: true }) ?? 3000,
  );
}
bootstrap();
