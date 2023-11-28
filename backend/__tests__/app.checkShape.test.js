/* This test will mock the Validator and retrieveShape functions and verify that the checkShape function is called correctly. */

const { checkShape } = require('../application/use-cases/checkShape');
const { Validator, retrieveShape, minimumDistance, arrivedCheck } = require('../application/use-cases/Validator');

jest.mock('../application/use-cases/Validator');

describe('checkShape', () => {
  it('should call checkShape correctly', async () => {
    const mockRepository = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          find: jest.fn().mockReturnValue({
            toArray: jest.fn().mockResolvedValue([{ shapeId: 'shape1' }])
          })
        })
      })
    };
    const mockShapes = [{ shapeId: 'shape1' }];
    const mockLookup = ['lookup1', 'lookup2'];
    const mockCollectionName = 'collection1';

    Validator.mockImplementation(() => {});
    retrieveShape.mockImplementation(() => ({ shapeId: 'shape1', first_stop: 'stop1', last_stop: 'stop2' }));
    minimumDistance.mockImplementation(() => 'minDistance');
    arrivedCheck.mockImplementation(() => 'arrivedCheckResult');

    const result = await checkShape(mockRepository, mockShapes, mockLookup, mockCollectionName);

    expect(result).toEqual({ shapeId: 'shape1', arrived: 'arrivedCheckResult' });
    expect(Validator).toHaveBeenCalled();
    expect(retrieveShape).toHaveBeenCalled();
    expect(minimumDistance).toHaveBeenCalled();
    expect(arrivedCheck).toHaveBeenCalled();
  });
});
