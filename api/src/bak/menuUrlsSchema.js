
const mongoose = require('../utils/dbUtils'), 
Schema = mongoose.Schema;

var MenuUrlsSchema = new Schema({          
    name : { type: String },
    url: {type: String}
});

module.exports = mongoose.model('menuUrls',MenuUrlsSchema);