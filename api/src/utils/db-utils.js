const dataSource = {
    userName: "xaviertung",
    password: "123456",
    host: "47.93.224.113",
    port: "27017",
    database: "nongcloud"
}
var mongoose = require('mongoose'),
    DB_URL = `mongodb://${dataSource.userName}:${dataSource.password}@${dataSource.host}:${dataSource.port}/${dataSource.database}?poolSize=100`;
    mongoose.Promise = require('bluebird');
/**
 * 连接
 */
mongoose.connect(DB_URL);

/**
  * 连接成功
  */
mongoose.connection.on('connected', function () {    
    console.log('Mongoose connection open to ' + DB_URL);  
});    

/**
 * 连接异常
 */
mongoose.connection.on('error',function (err) {    
    console.log('Mongoose connection error: ' + err);  
});    
 
/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function () {    
    console.log('Mongoose connection disconnected');  
});    

module.exports = mongoose;