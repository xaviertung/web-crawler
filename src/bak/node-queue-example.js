const async = require('async');
var q = async.queue(function (obj,cb) {

    // setTimeout(function () {
    
    // 　　console.log(obj);
    // 　　
    // },obj.time)
    async.mapLimit(obj.urls, 5, function(url, callback) {
        setTimeout(function () {
    
        　　callback(null, url)
        　　
        },100)
    }, (err, results) => {
        if (err) throw err
        // results is now an array of the response bodies
        console.log(results)
        cb();
    })
},1)
    
for (var i = 0; i<10; i++) {
　　console.log(1);
　　
　　q.push({name:i,time:i*100, urls:"http://www.baidu.com?random="+i},function (err) {
　　　　　　console.log(err);
　　})
};

for (var i = 0; i<10; i++) {
　　console.log(2);
　　q.push({name:1,time:1000, urls:"http://www.baidu.com?random="+i},function (err) {
　　　　console.log(err);
　　})
};
q.saturated = function() { 
    console.log('all workers to be used'); 
}
q.empty = function() { 
    console.log('no more tasks wating'); 
}
q.drain = function() { 
    console.log('all tasks have been processed'); 
}