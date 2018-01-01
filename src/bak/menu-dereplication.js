const ObjectID = require('mongodb').ObjectID;
const { find, remove, update } = require('./mongo-utils');


find({multiple:true, collection:"menuUrls"}).then(async(result) => {
    for(let menuUrl of result) {
        const result = await find({multiple:true, collection:"menuUrls", query:{
            "name": menuUrl.name,
            "url": menuUrl.url,
            "_id": {$ne: ObjectID(menuUrl._id)}
            },
            projection: {_id:1}
        });

        for(let url of result) {
            console.log(url["_id"])
            const flag = await remove({collection:"menuUrls", query: { "_id": ObjectID(url["_id"])}});
        }
    }
}).catch(err => {
    console.log(err)
});
