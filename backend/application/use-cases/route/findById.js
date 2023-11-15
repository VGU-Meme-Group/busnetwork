async function findById(repository, param, collectionName) {
    console.log(param)
    const database = repository.db("Cluster0")
    const collection = database.collection(collectionName)
    const query = await collection.find({routeId : param}).toArray();
    return query
}

exports.findById =  findById