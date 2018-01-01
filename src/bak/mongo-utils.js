const Promise  = require('bluebird');
const MongoClient = require('mongodb').MongoClient;
const dataSource = {
    userName: "xaviertung",
    password: "123456",
    host: "47.93.224.113",
    port: "27017",
    database: "nongcloud"
}
function getConnection(callback) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(`mongodb://${dataSource.userName}:${dataSource.password}@${dataSource.host}:${dataSource.port}/${dataSource.database}?connectTimeoutMS=${1000*10*6*20}&socketTimeoutMS=${1000*10*6*20}&keepAlive=60000&poolSize=100&reconnectTries=100`, async (err, db) => {
            if(err) {
                if(db) db.close();
                reject(err);
            } else {
                if(db) {
                    try {
                        const result = await callback(db);
                        if(db) db.close();
                        resolve(result);
                    } catch(err) {
                        if(db) db.close();
                        reject(err);
                    }
                }
            }
            
        });
    });
}
async function find({ multiple=true, collection, query={}, projection, sort, skip, limit }) {
    return getConnection(async(db) => {
        db = db.collection(collection);
        let result;
        if(multiple) {
            if(projection) {
                db = db.find(query, projection);
            } else {
                db = db.find(query);
            }
            if(sort) db = db.sort(sort);
            if(skip) db = db.skip(skip);
            if(limit) db = db.limit(limit);
            result = await db.toArray();
        } else {
            if(projection) {
                result = await db.findOne(query, projection);
            } else {
                result = await db.findOne(query);
            }
        }
        return result;
    });
}

async function insert({ collection, payload={} }) {
    return getConnection(async(db) => {
        const result = await db.collection(collection).insert(payload);
        return result;
    });
}

async function update({ collection, query={}, payload }) {
    return getConnection(async(db) => {
        db = db.collection(collection);
        const result = await db.updateOne(query, { $set : payload })
        return result;
    });
}

async function remove({ multiple=false, collection, query={} }) {
    return getConnection(async(db) => {
        db = db.collection(collection);
        const result = await db.remove(query, {
            justOne : multiple
        });
        return result;
    });
}

module.exports = {
    find,
    update,
    insert,
    remove
}