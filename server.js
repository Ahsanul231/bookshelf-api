import Hapi from '@hapi/hapi';
import routes from './routes/books.js';

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'], // Allow CORS for any origin
      },
    },
  });

  server.route(routes);

  await server.start();
  console.log(`Server is running on ${server.info.uri}`);
};

init();
