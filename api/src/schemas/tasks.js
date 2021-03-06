
const mongoose = require('../utils/db-utils'),
Schema = mongoose.Schema;
var Tasks = new Schema({
    completed : { type : Boolean, default: false },
    stepIndex : { type: Number, default: 0 },
    steps : [ { type : Schema.Types.ObjectId, ref : "steps" } ]
});

module.exports = mongoose.model('tasks', Tasks);