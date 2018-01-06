const fs = require('fs');

const crawl = require('../crawlers/basic-crawler');

const input = fs.readFileSync("./src/secondaryUrlsWithPageSize.json", "utf8");
const out = fs.createWriteStream("./src/menuUrls.bak.json")

const rootUrl = "http://www.meishij.net";

const urlMapping = JSON.parse(input);
let urls = [];
for(let k in urlMapping) {
    const pageSize = parseInt(urlMapping[k]);
    for(let i=1; i<=pageSize; i++) {
        const url = k.indexOf("?")!=-1?k+`&page=${i}`:k+`?page=${i}`;
        urls.push(url);
    }
}
async function start() {
    const options = {
        urls : urls,
        exec : function($, callback) {
            const menuUrls = {};
            $(".listtyle1_list .listtyle1").find("a.big").map((i, el) => {
                const k = $(el).attr("title");
                const v = $(el).attr("href");
                menuUrls[k] = /^http:\/\//.test(v)?v:rootUrl+v;
            })
            callback(null, menuUrls);
       }
    };
    const data = await crawl(options);
    out.write(JSON.stringify(data));
}
start();
