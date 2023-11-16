require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

function connection() {
    const username = process.env.MONGODB_ATLAS_USER
    const pass = process.env.MONGODB_ATLAS_PASSWORD
    const address = process.env.MONGODB_ATLAS_CLUSTER_ADDRESS
    const database = process.env.MONGODB_DATABASE_NAME
    const uri = `mongodb+srv://${username}:${pass}@${address}/${database}?retryWrites=true&w=majority`

    function connectToMongo(){
        const client = new MongoClient(uri, {
            serverApi: {
              version: ServerApiVersion.v1,
              strict: true,
              deprecationErrors: true,
            }
        });
        return client
    }

    return {
        connectToMongo
    }
}

exports.DBconnection =  connection

