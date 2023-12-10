async function findByShapeId(repository, param, collectionName) {
    const collection = repository.collection(collectionName)
    const query = await collection.find({shapeId : param}).toArray();
    return query
}

exports.findByShapeId =  findByShapeId