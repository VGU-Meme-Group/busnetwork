const {workerData, parentPort} = require("worker_threads")
const { DBconnection } = require('../../repository/connection')
const { lookup } = require("dns")
const shapeID = workerData.shapeID
const array = workerData.result
console.log(shapeID)

const client = DBconnection().connectToMongo()
const collectionName = "shapes"
const database = client.db("Cluster0")
const collection = database.collection(collectionName);

const fetchData = async (queryCollection, shape) =>{
    console.log(queryCollection)
    const query = await queryCollection.find().toArray()
    console.log(query)
}

fetchData(collection, shapeID)

// console.log(client)




