
const mongoose = require('../utils/db-utils'),
Schema = mongoose.Schema;
var Results = new Schema({
    stepId : { type : Schema.Types.ObjectId, ref: "steps" },
    url: { type: String },
    content : { type : Schema.Types.Mixed }
});

module.exports = mongoose.model('results', Results);