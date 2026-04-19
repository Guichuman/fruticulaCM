import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app/app.module';

async function inicializar() {
  console.log(`⚙️  NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`⚙️  DATABASE_URL definida: ${!!process.env.DATABASE_URL}`);
  console.log(`⚙️  DB_HOST: ${process.env.DB_HOST || '(não definido)'}`);

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const porta = Number(process.env.PORT || 3000);
  console.log(`⚙️  PORT env: ${process.env.PORT} | Usando porta: ${porta}`);
  await app.listen(porta, '0.0.0.0');
  console.log(`🚀 Frutícola CM API rodando na porta ${porta}`);
}

inicializar().catch((err) => {
  console.error('❌ Falha ao inicializar a aplicação:', err);
  process.exit(1);
});
