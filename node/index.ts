/* Supress unnecessary expressjs logs */
process.env.NODE_ENV = 'production';
// process.env.NODE_ENV = 'development';

import log from 'npmlog';
import express from 'express';
import cors from 'cors';
import path from 'path';
import ServerController from './controller/ServerController';
import setup from './setup';
import {exec} from 'child_process';
import runTests from './test'

console.log(`
  ██████╗ ███████╗ ██╗  ██╗  █████╗  ██╗    
 ██╔════╝ ██╔════╝ ██║ ██╔╝ ██╔══██╗ ██║    
 ╚█████╗  █████╗   █████═╝  ███████║ ██║    
  ╚═══██╗ ██╔══╝   ██╔═██╗  ██╔══██║ ██║    
 ██████╔╝ ███████╗ ██║ ╚██╗ ██║  ██║ ██║ ██╗
 ╚═════╝  ╚══════╝ ╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚═╝ ╚═╝
                            Version 0.1b\n
`);

/* Setup logging */
log.enableColor();
log.heading = 'sekai';
log.headingStyle = {
  fg: 'grey',
  bold:true,
};

/* Setup dirs */
log.info('', 'Setting up files');
setup();

/* Setup HTTP server */
log.info('', 'Setting up HTTP server');
const server = express();

const staticPath = path.join(__dirname, 'static');

server.use(cors());
server.use(express.json());
server.use(express.static(staticPath));
server.use(ServerController);

server.get('/*', (req, res) => {
  res.sendFile(staticPath + '/index.html');
});

const port = process.env.SEKAI_PORT || 5420;

server.listen(port, async () => {
  log.info('', `Done! Visit http://localhost:${port} in your browser.`);
  exec(`start http://localhost:${port}`);
  runTests(false);
});
