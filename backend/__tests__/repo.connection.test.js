// check if the connectToMongo function returns an instance of MongoClient

const { MongoClient } = require('mongodb');
const { DBconnection } = require('../repository/connection');

jest.mock('mongodb');

describe('DB Connection', () => {
  it('should return a MongoClient instance', () => {
    const connection = DBconnection();
    const client = connection.connectToMongo();
    expect(client).toBeInstanceOf(MongoClient);
  });
});
