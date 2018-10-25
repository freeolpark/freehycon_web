import './common/env';
import Server from './common/server';
import Client from './common/client'
import routes from './routes';

const port = parseInt(process.env.PORT);
new Server()
  .router(routes)
  .listen(port);


new Client()
  .router(routes)
  .listen(8080);