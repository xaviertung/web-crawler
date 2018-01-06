const request = require('request');
const cheerio = require('cheerio');
const async = require('async');

function craw(url, callback) {
    request.get(url, function(err, result) {
        if(err) {
            console.error(err);
            return;
        }
    
        const materials = {};
    
        const $ = cheerio.load(result.body);
    
        const title = $('#tongji_title').eq(0).text();
    
        materials["title"] = title;
    
        const mayors = [], minors = [];
    
        $('.materials .yl.zl ul li .c h4').map((i, el) => {
            const name = $(el).find("a").text();
            const quantity = $(el).find("span").text();
            mayors.push({
                name,
                quantity
            });
        });
        materials["mayors"] = mayors;
        const minor = $('.materials .yl.fuliao ul li').map((i, el) => {
            const name = $(el).find("h4 a").text();
            const quantity = $(el).find("span").text();
            minors.push({
                name,
                quantity
            });
        });
        materials["minors"] = minors;
        
        const favorite = $(".addToFav_con").html();
        console.log("haha",favorite)
        materials["favorite"] = favorite;
    
        // console.log(materials);
        callback(null, materials);
    })
}

const urls = [];
urls.push("http://www.meishij.net/zuofa/kelejichi_303.html");
urls.push("http://www.meishij.net/zuofa/wuhuaroudoufubaicaibao.html");
urls.push("http://www.meishij.net/zuofa/ganbiancaihua_5.html");
urls.push("http://www.meishij.net/zuofa/jingmianguojiaodeliangzhongjianyizuofa.html");
urls.push("http://www.meishij.net/zuofa/jingyingtitoushuijingguantangjiao.html")


async.mapLimit(urls, 5, function(url, callback) {
    craw(url, callback);
}, function(err, result) {
    console.log('===== result: ======\n', JSON.stringify(result));
})
