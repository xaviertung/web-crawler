const request = require('request');
const cheerio = require('cheerio');
const async = require('async');
const fs = require('fs');

const out = fs.createWriteStream("./src/secondaryUrls.json")

const rootUrl = "http://www.meishij.net";

const primaryUrls = {"家常菜谱":"http://www.meishij.net/chufang/diy/","中华菜系":"http://www.meishij.net/china-food/caixi/","各地小吃":"http://www.meishij.net/china-food/xiaochi/","外国菜谱":"http://www.meishij.net/chufang/diy/guowaicaipu1/","烘焙":"http://www.meishij.net/hongpei/"};


function craw(url, callback) {
    request.get(url, function(err, result) {
        if(err) {
            console.error(err);
            return;
        }
    
    
        const $ = cheerio.load(result.body);

        const secondaryUrls = {};
        $(".listnav_dl_style1").find("dd a").map((i, el) => {
            const k = $(el).text();
            const v = $(el).attr("href");
            secondaryUrls[k] = /^http:\/\//.test(v)?v:rootUrl+v;
        })

        
        callback(null, secondaryUrls);
    })
}

async.mapLimit(Object.values(primaryUrls), 5, function(url, callback) {
    craw(url, callback);
}, function(err, result) {
    console.log('===== result: ======\n', JSON.stringify(result));
    let _primaryUrls = {};
    for(let urls of result) {
        _primaryUrls = Object.assign(_primaryUrls, urls)
    }
    out.write(JSON.stringify(_primaryUrls))
})
