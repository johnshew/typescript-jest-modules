import { mocked } from 'ts-jest';
import { Server } from '../httpServer';
import { Foo } from '../foo';
import app, { App, AppConfig } from '../app';

jest.mock('../app');
jest.mock('../httpServer');

const serverMockedOpt = mocked(Server,true); //: jest.Mock<Server> = <any> Server;
const serverMocked : jest.Mock<Server> = <any> Server;
serverMocked.mockImplementation((...args: any) => {
    return {
        server: null,
        asyncClose: jest.fn<Promise<void>, any>().mockResolvedValue(),
    }
});

const appMocked : jest.Mock<App> = <any> App ;
appMocked.mockImplementation((...args: any) => {
    return {
        ready: Promise.resolve({} as App),
        foo: new Foo(),
        appHttpServer: new Server('8080'),
        close: jest.fn<Promise<void>, any>().mockResolvedValue()
    }
});


describe("Foo", () => {

    test('Mock the app and web server to test Foo', async (done) => {
        let app = new App();
        await app.ready;
        expect(app.foo).toBeDefined();
        expect(app.foo.compute()).toBe(true);
        await app.close();
        expect(app.close).toBeCalled();
        done();
    });

});
