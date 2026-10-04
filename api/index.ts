// api/index.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);

  // Obtener la instancia pura de Express
  const expressApp = app.getHttpAdapter().getInstance();

  // Middleware manual para garantizar CORS en todas las rutas y métodos OPTIONS
  expressApp.use((req: any, res: any, next: any) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, Content-Length, X-Requested-With, Accept',
    );

    // Responder inmediatamente con 200 OK a las peticiones preflight OPTIONS
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    next();
  });

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: false, // Con origin: '*' no se usa credentials: true
  });

  await app.init();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  // Evitar que Lambda/Vercel espere a que el event loop de Node quede vacío (ideal para DB pool)
  context.callbackWaitsForEmptyEventLoop = false;
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};