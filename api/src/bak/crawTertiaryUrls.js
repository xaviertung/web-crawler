const request = require('request');
const cheerio = require('cheerio');
const async = require('async');
const fs = require('fs');

const input = fs.readFileSync("./secondaryUrls.json", "utf8")

const rootUrl = "http://www.meishij.net";

const secondaryUrls = JSON.parse(input);


function craw(url, callback) {
    request.get(url, function(err, result) {
        if(err) {
            console.error(err);
            return;
        }
    
    
        const $ = cheerio.load(result.body);

        const tertiaryUrls = {};
        $(".listtyle1_list .listtyle1").find("a.big").map((i, el) => {
            const k = $(el).attr("title");
            const v = $(el).attr("href");
            tertiaryUrls[k] = /^http:\/\//.test(v)?v:rootUrl+v;
        })

        
        callback(null, tertiaryUrls);
    })
}

async.mapLimit(Object.values(secondaryUrls), 5, function(url, callback) {
    craw(url, callback);
}, function(err, result) {
    console.log('===== result: ======\n', JSON.stringify(result));
    // let _primaryUrls = {};
    // for(let urls of result) {
    //     _primaryUrls = Object.assign(_primaryUrls, urls)
    // }
    // out.write(JSON.stringify(_primaryUrls))
})

// console.log(tertiaryUrls)
