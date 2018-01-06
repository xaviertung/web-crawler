const request = require('request');
const cheerio = require('cheerio');
const async = require('async');
const MongoClient = require('mongodb').MongoClient;


const rootUrl = "http://www.meishij.net/shicai/";

function craw(url, callback) {
    url += url.indexOf("?")!=-1?"&page=10000":"?page=10000";
    request.get(url, function(err, result) {
        if(err) {
            console.error(err);
            return;
        }
    
        const $ = cheerio.load(result.body);
        callback(null, { url, max: $(".listtyle1_page_w a").last().text()});
    })
}



request.get(rootUrl, function(err, result) {
    if(err) {
        console.error(err);
        return;
    }

    const $ = cheerio.load(result.body);

    const categories = {};
    $(".listnav_con dl").last().remove();
    $(".listnav_con dl").map((i, el) => {
        const primary = $(el).find("dt").text();
        const secondary = {};
        $(el).find("dd a").map((i, el) => {
            secondary[$(el).text()] = $(el).attr("href");
        });
        categories[$(el).find("dt").text()] = {
            primary,
            secondary
        };
    })

    let urls = [];
    for(let mainKey in categories) {
        const subCategory = categories[mainKey]["secondary"];
        urls = urls.concat(Object.values(subCategory));
    }
    // console.log(urls);

    async.mapLimit(urls, 5, function(url, callback) {
        craw(url, callback);
    }, function(err, result) {
        // console.log('===== result: ======\n', JSON.stringify(result));

        MongoClient.connect("mongodb://xaviertung:123456@47.93.224.113/nongcloud", function(err, db) {
            console.log("连接成功！");
            db.collection("menuUrls").insert(result, function(err, result) { 
                if(err)
                {
                    console.log('Error:'+ err);
                    return;
                }
                db.close();     
            });
        });
    })
})