// 

const { findByShapeId } = require('../application/use-cases/segment/findById')

describe('findByShapeId', () => {
  it('should call findByShapeId correctly', async () => {
    const mockRepository = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          find: jest.fn().mockReturnValue({
            toArray: jest.fn().mockResolvedValue('findByShapeIdResult')
          })
        })
      })
    };
    const mockParam = 'param1';
    const mockCollectionName = 'collection1';

    const result = await findByShapeId(mockRepository, mockParam, mockCollectionName);

    expect(result).toEqual('findByShapeIdResult');
  });
});
