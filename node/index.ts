import express from 'express';
import path from 'path';

import ServerController from './controller/ServerController';
import { getBinPath } from './util/path-util';

const server = express();

server.use(express.static(path.join(__dirname, '../view/build')));

server.use(ServerController);

const PORT = process.env.PORT || 5420;
server.listen(PORT, () => {
  console.log(`Running @ ${PORT}`);
});