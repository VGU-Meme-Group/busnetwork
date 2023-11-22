//The test will mock the repository and collection objects and verify that the functions are called correctly

const { findAll } = require('../application/use-cases/bus/findAll');

describe('findAll', () => {
  it('should call findAll correctly', async () => {
    const mockRepository = {
      collection: jest.fn().mockReturnValue({
        find: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue('findAllResult')
        })
      })
    };
    const mockCollectionName = 'collection1';

    const result = await findAll(mockRepository, mockCollectionName);

    expect(result).toEqual('findAllResult');
  });
});
