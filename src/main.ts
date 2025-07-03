import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ErrorLoggerService } from './common/services/error-logger.service';
import { AppExceptionFilter } from './common/filters/app-exception.filter';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('/api');

    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );

    app.use(cookieParser());

    const errorLogger = app.get(ErrorLoggerService);
    app.useGlobalFilters(new AppExceptionFilter(errorLogger));

    await app.listen(process.env.PORT ?? 3000);
  } catch (error) {
    console.log(error);
  }
}
bootstrap();
