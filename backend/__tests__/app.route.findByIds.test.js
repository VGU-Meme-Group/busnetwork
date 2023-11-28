// The test will mock the repository and collection objects and verify that the functions are called correctly

const { findById } = require('../application/use-cases/route/findById');

describe('findById', () => {
  it('should call findById correctly', async () => {
    const mockRepository = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          find: jest.fn().mockReturnValue({
            toArray: jest.fn().mockResolvedValue('findByIdResult')
          })
        })
      })
    };
    const mockParam = 'param1';
    const mockCollectionName = 'collection1';

    const result = await findById(mockRepository, mockParam, mockCollectionName);

    expect(result).toEqual('findByIdResult');
  });
});
