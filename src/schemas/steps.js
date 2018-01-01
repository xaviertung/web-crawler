const mongoose = require('../utils/db-utils'), 
Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');
var Steps = new Schema({
    taskId : { type : Schema.Types.ObjectId, ref: "tasks" },
    urls : { type : Array },
    exec : { type : String }, 
    mode : { type : Number }
});

module.exports = mongoose.model('steps', Steps);