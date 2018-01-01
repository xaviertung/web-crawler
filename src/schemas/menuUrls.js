
const mongoose = require('../utils/db-utils'), 
Schema = mongoose.Schema;

var MenuUrls = new Schema({          
    name : { type: String },
    url: {type: String}
});

module.exports = mongoose.model('menuUrls', MenuUrls);