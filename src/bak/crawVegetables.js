const request = require('request');
const cheerio = require('cheerio');
const async = require('async');

function craw(url, callback) {
    request.get(url, function(err, result) {
        if(err) {
            console.error(err);
            return;
        }
    
        const $ = cheerio.load(result.body);
    
        const vegetables = $('.listtyle1').find('.info1 h3 a').map((i, el) => {
            return {
                name: $(el).text(),
                url: $(el).attr("href")
            }
        });
    
        
        callback(null, vegetables);
    })
}

const urls = [];
const pageSizes = 476;
for(let i=1; i<=476; i++) {
    urls.push(`http://www.meishij.net/shicai/?page=${i}`);
}



async.mapLimit(urls, 5, function(url, callback) {
    craw(url, callback);
}, function(err, result) {
    console.log('===== result: ======\n', JSON.stringify(result));
})
