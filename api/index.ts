// api/index.ts
// eslint-disable-next-line @typescript-eslint/no-var-requires
const main = require('../dist/src/main');

export default async function handler(req: any, res: any) {
  const serverHandler = main.default || main.handler || main;
  return serverHandler(req, res);
}