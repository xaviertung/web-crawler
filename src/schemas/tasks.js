
const mongoose = require('../utils/db-utils'),
Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');
var Tasks = new Schema({
    stepIndex : { type: Number, default: 0 },
    steps : [ { type : Schema.Types.ObjectId, ref : "steps" } ]
});

module.exports = mongoose.model('tasks', Tasks);