
import { logger } from './utils';
console.log(logger`loading app`);
import { Server as AppHttpServer } from './httpServer';
import { Foo } from './foo';


export class AppConfig {
    static readonly appId = '1234'
}


export class App {
    // This is a namespace to the set of centralized services used throughout the application.
    ready: Promise<App> = null;
    appHttpServer: AppHttpServer;
    foo: Foo;

    constructor() {

        this.ready = new Promise(async (resolve, reject) => {
            try {
                this.foo = new Foo();
                resolve();
            }
            catch (err) {
                console.log(logger`initialization failed`, err);
                reject();
            }
        });

    }

    async close(): Promise<void> {
        return;
    }
}

var app : App = null;
export default app;

async function start() {
    try {
        app = new App();
        await app.ready;
        console.log(logger`app started`);
    } catch (err) {
        console.log(logger`app start failed`,err);
    }
}

start();

