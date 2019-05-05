
import { Server } from '../httpServer';
import { Foo } from '../foo';
import fetch from 'node-fetch';
import { App } from '../app';

jest.mock('../app');
jest.mock ('../foo');

const fooMocked = Foo as any as jest.Mock<Foo>;
fooMocked.mockImplementation((...args: any) => {
    return {
       compute: jest.fn().mockReturnValue(false)
    }
});

const appMocked = App as any as jest.Mock<App>;
appMocked.mockImplementation((...args: any) => {
    return {
        ready: Promise.resolve({} as App),
        foo: new Foo(),
        appHttpServer: new Server('8080'),
        close: jest.fn<Promise<void>,any>().mockResolvedValue()
    } 
});


describe("Http Server", () => {
    let app : App;

    beforeAll(()=>{
        app = new App();
    })

    test('Check config', async (done)=>{
        await app.ready;
        expect(app.foo).toBeDefined();
        expect(app.appHttpServer).toBeDefined();
        expect(app.foo.compute()).toBe(false);
        await app.close();
        expect(app.close).toBeCalled();
        done();
    });

    test("test actual web server", async (done) => {
        let response = await fetch('http://localhost:8080');
        expect(response.status).toBe(200);
        expect(response.url).toBe('http://localhost:8080/public/app.html');
        done();
    });

});
