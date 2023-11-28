const request = require('supertest');
const app = require('../index');

describe('Test the root path', () => {
    test('It should response the GET method', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    });
});

describe('Test socket.io events', () => {
    let io, serverSocket, clientSocket;

    beforeAll((done) => {
        const httpServer = require('http').createServer().listen();
        const port = httpServer.address().port;
        io = require('socket.io')(httpServer);

        io.on('connection', (socket) => {
            serverSocket = socket;
        });

        clientSocket = require('socket.io-client')(`http://localhost:${port}`);
        clientSocket.on('connect', done);
    });

    afterAll(() => {
        io.close();
        clientSocket.close();
    });

    test('should work', (done) => {
        clientSocket.on('receive-all-routes', (data) => {
            expect(data).toBeDefined();
            done();
        });

        clientSocket.emit('get-buses');
    });
});
