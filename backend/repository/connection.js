require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

function connection() {
    const url = process.env.MONGODB_URL;
    function connectToMongo(){
        const client = new MongoClient(url, {
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

