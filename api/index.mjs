import serverlessExpress from '@vendia/serverless-express';

let server;

async function bootstrap() {
  const { NestFactory } = await import('@nestjs/core');
  
  // Cargar el módulo compilado
  let AppModule;
  try {
    const mod = await import('../dist/src/app.module.js');
    AppModule = mod.AppModule;
  } catch (e) {
    const mod = await import('../dist/app.module.js');
    AppModule = mod.AppModule;
  }

  const app = await NestFactory.create(AppModule);
  const expressApp = app.getHttpAdapter().getInstance();

  expressApp.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, Content-Length, X-Requested-With, Accept',
    );

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    next();
  });

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: false,
  });

  await app.init();
  return serverlessExpress({ app: expressApp });
}

export default async function handler(req, res) {
  if (!server) {
    server = await bootstrap();
  }
  return server(req, res);
}