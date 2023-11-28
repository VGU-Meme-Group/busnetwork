/*This test will mock the express, cors, body-parser, and dotenv modules, as well as the DBconnection, findById, findByShapeId, and checkShape functions, and verify that the endpoints are called correctly.*/

const request = require('supertest');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { DBconnection } = require('../repository/connection');
const { findById } = require('../application/use-cases/route/findById');
const { findByShapeId } = require('../application/use-cases/segment/findById');
const { checkShape } = require('../application/use-cases/checkShape');

jest.mock('express');
jest.mock('cors');
jest.mock('body-parser');
jest.mock('../repository/connection');
jest.mock('../application/use-cases/route/findById');
jest.mock('../application/use-cases/segment/findById');
jest.mock('../application/use-cases/checkShape');

describe('main', () => {
  it('should call endpoints correctly', async () => {
    const mockApp = {
      use: jest.fn(),
      get: jest.fn(),
      post: jest.fn(),
      listen: jest.fn(),
    };
    express.mockReturnValue(mockApp);
    cors.mockReturnValue('cors');
    // bodyParser.json.mockReturnValue('json');
    bodyParser.json = jest.fn().mockReturnValue('json');
    DBconnection.mockReturnValue({ connectToMongo: jest.fn() });
    findById.mockResolvedValue('findByIdResult');
    findByShapeId.mockResolvedValue('findByShapeIdResult');
    checkShape.mockResolvedValue('checkShapeResult');

    require('../main');

    expect(express).toHaveBeenCalled();
    expect(cors).toHaveBeenCalled();
    expect(bodyParser.json).toHaveBeenCalled();
    expect(mockApp.use).toHaveBeenCalledWith('cors');
    expect(mockApp.use).toHaveBeenCalledWith('json');
    expect(mockApp.get).toHaveBeenCalledWith('/getRoute/:routeId', expect.any(Function));
    expect(mockApp.post).toHaveBeenCalledWith('/checkShape', expect.any(Function));
    expect(mockApp.get).toHaveBeenCalledWith('/getSegments/:shapeId', expect.any(Function));
    expect(mockApp.listen).toHaveBeenCalledWith(process.env.SERVER_PORT, expect.any(Function));
  });
});
