const request = require('request');
const cheerio = require('cheerio');
const async = require('async');
const fs = require('fs');

const input = fs.readFileSync("./secondaryUrls.json", "utf8");
const out = fs.createWriteStream("./secondaryUrlsWithPageSize.json")

const rootUrl = "http://www.meishij.net";

const secondaryUrls = JSON.parse(input);


function craw(url, callback) {
    request.get(url, function(err, result) {
        if(err) {
            console.error(err);
            return;
        }
    
    
        const $ = cheerio.load(result.body);

        const regExp = /共(.*?)页/;
        const pageSize = $('.gopage').find('form').text().match(regExp)[1];
        callback(null, {
            url,
            pageSize
        });
    })
}

async.mapLimit(Object.values(secondaryUrls), 5, function(url, callback) {
    craw(url, callback);
}, function(err, result) {
    // console.log('===== result: ======\n', JSON.stringify(result));
    let _secondaryUrlsWithPageSize = {};
    for(let urls of result) {
        _secondaryUrlsWithPageSize[urls.url] = urls.pageSize; 
    }
    out.write(JSON.stringify(_secondaryUrlsWithPageSize))
})

// console.log(tertiaryUrls)
