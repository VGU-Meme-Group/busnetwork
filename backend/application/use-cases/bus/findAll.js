async function findAll(repository, collectionName) {
    const collection = repository.collection(collectionName)
    const query = await collection.find().toArray()
    return query
}

exports.findAll =  findAll