async function findByShapeId(repository, param, collectionName) {
    const database = repository.db("Cluster0")
    const collection = database.collection(collectionName)
    const query = await collection.find({shapeId : param}).toArray();
    return query
}

exports.findByShapeId =  findByShapeId