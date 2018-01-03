const phantom = require('phantom');

const _userAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36`;
const phantomCrawler = async ({ url, exec, scripts=["https://cdn.bootcss.com/jquery/1.12.4/jquery.js"], userAgent=_userAgent }) => {
    const instance = await phantom.create();
    const page = await instance.createPage();
    page.setting("userAgent", userAgent);
    const status = await page.open(url);
    if (status !== 'success') {
        console.log("访问失败");
        return;
    } else {
        let start = Date.now();
        if(scripts&& scripts.length>0) {
            for(let script of scripts) {
                await page.includeJs(script)
            }
        }
        
        let result = await page.evaluate(function(_exec) {
            var body = {};
            eval(_exec)
            return body;
        }, exec);
        let resultValue = {
            code: 1,
            msg: "抓取成功",
            time: Date.now() - start,
            data: result
        }
        
        await instance.exit();
        return resultValue;
    }

};

module.exports = phantomCrawler;