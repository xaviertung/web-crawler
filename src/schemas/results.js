
const mongoose = require('../utils/db-utils'),
Schema = mongoose.Schema;
var Results = new Schema({
    url: { type: String },
    content : { type : Schema.Types.Mixed }
});

module.exports = mongoose.model('results', Results);