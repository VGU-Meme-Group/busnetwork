const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const socketIOClient = require('socket.io-client');
const supertest = require('supertest');
const { DBconnection } = require('../repository/connection');
const { findAll } = require('../application/use-cases/bus/findAll');

// Import your app from the main file
const app = require('../index.js'); // Update with your actual file name

describe('Express and Socket.IO Server Tests', () => {
  let server;
  let io;
  let socket;

  beforeAll((done) => {
    server = http.createServer(app);
    io = new Server(server);
    server.listen(5000, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  beforeEach((done) => {
    // Connect a socket for each test
    socket = socketIOClient('http://localhost:5000');
    socket.on('connect', done);
  });

  afterEach(() => {
    // Disconnect the socket after each test
    socket.disconnect();
  });

  describe('Socket.IO Connection', () => {
    it('should connect to Socket.IO server', (done) => {
      socket.on('connect', () => {
        expect(socket.connected).toBe(true);
        done();
      });
    });
  });

  describe('Socket.IO Events', () => {
    it('should emit "receive-all-routes" event on "get-buses" event', (done) => {
      const mockData = [{ route: 'Route 1' }, { route: 'Route 2' }];

      // Mock the findAll function to return data
      findAll.mockResolvedValueOnce(mockData);

      socket.emit('get-buses');

      socket.on('receive-all-routes', (data) => {
        expect(data).toEqual(mockData);
        done();
      });
    });
  });

  describe('HTTP API Tests', () => {
    it('should respond with 200 OK on GET /', async () => {
      const response = await supertest(app).get('/');
      expect(response.status).toBe(200);
    });

    // Add more HTTP API tests as needed
  });
});
