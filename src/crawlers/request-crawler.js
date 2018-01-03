const request = require('request-promise');
const cheerio = require('cheerio');
const requestCrawler = async({ url, exec }) => {
    let start = Date.now();
    const result = await request.get(url);
    const $ = cheerio.load(result); 
    var body = {};
    eval(exec)
    let resultValue = {
        code: 1,
        msg: "抓取成功",
        time: Date.now() - start,
        data: body
    }
    return resultValue;
};

module.exports = requestCrawler;