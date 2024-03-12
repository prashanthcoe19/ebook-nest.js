import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ValidateInputPipe } from './core/pipes/validate.pipe';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  try {
    console.log('Nest Application Starting....');
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api/v1');
    // handle all user input validation globally
    app.useGlobalPipes(new ValidateInputPipe());
    app.use(cookieParser());
    app.enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });
    await app.listen(3000);
    console.log('Listening at port 3000');
  } catch (error) {
    console.log(error);
    console.error('Error starting the application:', error);
  }
}
bootstrap();
