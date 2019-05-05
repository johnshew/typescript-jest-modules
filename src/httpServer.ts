
import * as restify from 'restify';
import * as http from 'http';

import { logger } from './utils';

export class Server {
    server: restify.Server;

    constructor(port: string, requestListener?: (req: http.IncomingMessage, res: http.ServerResponse) => void) {
        this.server = restify.createServer(<restify.ServerOptions>{ maxParamLength: 1000 });
        configureServer(this.server);
        this.server.listen(port, () => {
            console.log(`${this.server.name} listening to ${this.server.url}`);
        });
    }

    async asyncClose(callback?: () => void): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.server.close(() => {
                console.log('Closed httpServer');
                if (callback) callback();
                return resolve();
            })
        });
    }
}

function configureServer(httpServer: restify.Server) {

    httpServer.pre((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        return next();
    });

    httpServer.use(restify.plugins.bodyParser());
    httpServer.use(restify.plugins.queryParser());

    httpServer.use((req, res, next) => {
        console.log(logger`Request for ${req.url} `);
        next();
    });

    //// Static pages

    httpServer.get('/', (req, res, next) => { res.redirect('./public/app.html', next); });
    httpServer.get("/public/app.html/*", restify.plugins.serveStatic( {directory: __dirname + '/..' , file: "app.html"}));
    httpServer.get("/public/*", restify.plugins.serveStatic({ directory: __dirname + '/..' }));
}

