// connection.test.js
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');
jest.mock('mongodb');
jest.mock('dotenv');

const { DBconnection } = require('../repository/connection');

describe('DBconnection', () => {
  it('should call connectToMongo correctly', () => {
    dotenv.config.mockImplementation(() => ({
      parsed: {
        MONGODB_ATLAS_USER: 'bachvo01',
        MONGODB_ATLAS_PASSWORD: '72062001Mongo',
        MONGODB_ATLAS_CLUSTER_ADDRESS: 'cluster0.b2js1oc.mongodb.net',
        MONGODB_DATABASE_NAME: 'Cluster0',
      },
    }));

    const mockClient = {
      connect: jest.fn(),
    };
    MongoClient.mockImplementation(() => mockClient);

    const connection = DBconnection();
    connection.connectToMongo();

    expect(MongoClient).toHaveBeenCalledWith(
      'mongodb+srv://bachvo01:72062001Mongo@cluster0.b2js1oc.mongodb.net/Cluster0?retryWrites=true&w=majority',
      {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      }
    );
    expect(mockClient.connect).toHaveBeenCalled();
  });
});
