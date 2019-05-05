
import { Server } from '../httpServer';
import { Foo } from '../foo';
import fetch from 'node-fetch';
import app, { App, AppConfig } from '../app';
import { nullableTypeAnnotation } from '@babel/types';

jest.mock('../app');
jest.mock('../httpServer');

const serverMocked = Server as any as jest.Mock<Server>;
serverMocked.mockImplementation((...args: any) => {
    return {
        server: null,
        asyncClose: jest.fn<Promise<void>, any>().mockResolvedValue(),
    }
});

const appMocked = App as any as jest.Mock<App>;
appMocked.mockImplementation((...args: any) => {
    return {
        ready: Promise.resolve({} as App),
        foo: new Foo(),
        appHttpServer: new Server('8080'),
        close: jest.fn<Promise<void>, any>().mockResolvedValue()
    }
});


describe("Foo", () => {

    test('Check config', async (done) => {
        let app = new App();
        await app.ready;
        expect(app.foo).toBeDefined();
        expect(app.foo.compute()).toBe(true);
        await app.close();
        expect(app.close).toBeCalled();
        done();
    });

});
