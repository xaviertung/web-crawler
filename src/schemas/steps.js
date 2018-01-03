const mongoose = require('../utils/db-utils'), 
Schema = mongoose.Schema;
var Steps = new Schema({
    taskId : { type : Schema.Types.ObjectId, ref: "tasks" },
    result : { type : Schema.Types.ObjectId, ref: "results" },
    urls : { type : Array },
    exec : { type : String }, 
    mode : { type : Number }
});

module.exports = mongoose.model('steps', Steps);