const { Validator, retrieveShape, minimumDistance, arrivedCheck } = require('./Validator')

async function checkShape(repository, shapes, lookup, collectionName, collection) {
    let minArray = []
    let min = Infinity
    // const database = repository.db("Cluster0")
    // const collection = repository.collection(collectionName);
    for(let i = 0; i < shapes.length; i++){
      const query = await collection.find({shapeId : shapes[i].shapeId}).toArray()
      Validator(query, lookup, minArray)
    }
    // console.log(minArray)

    console.log(retrieveShape(minArray, minimumDistance(minArray, min)))
    const result = retrieveShape(minArray, minimumDistance(minArray, min)).shapeId
    const first = retrieveShape(minArray, minimumDistance(minArray, min)).first_stop
    const second = retrieveShape(minArray, minimumDistance(minArray, min)).last_stop
    
    return {shapeId : result , arrived : arrivedCheck(first, second, lookup)}
}

module.exports = checkShape