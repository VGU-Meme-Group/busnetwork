const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { findByShapeId } = require('../application/use-cases/segment/findById'); // Update with your actual module file path

let mongoServer;
let mongoClient;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  mongoClient = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  await mongoClient.connect();
});

afterAll(async () => {
  await mongoClient.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  const collections = await mongoClient.db().collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

test('findByShapeId should return the correct result', async () => {
  const testCollectionName = 'testCollection';
  const testData = [
    { shapeId: '123', otherField: 'value1' },
    { shapeId: '456', otherField: 'value2' },
    { shapeId: '789', otherField: 'value3' },
  ];

  const collection = mongoClient.db().collection(testCollectionName);
  await collection.insertMany(testData);

  const result = await findByShapeId(mongoClient, '123', testCollectionName);
  expect(result).toEqual([{ shapeId: '123', otherField: 'value1' }]);
});

// Add more tests as needed
