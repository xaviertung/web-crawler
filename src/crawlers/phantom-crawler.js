const phantom = require('phantom');

const crawl = async ({ url, exec, scripts, userAgent }) => {
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
        
        let result = await page.evaluate(exec);
        let data = {
            cose: 1,
            msg: "抓取成功",
            time: Date.now() - start,
            dataList: result
        }
        
        await instance.exit();
        return JSON.stringify(data);
    }

};

const exec = function() {

    var mayors = [], minors = [];

    mayors = $('.materials .yl.zl ul li .c h4').map(function() {
        var name = $(this).find("a").text();
        var quantity = $(this).find("span").text();
        return {
            name: name,
            quantity: quantity
        };
    }).toArray();
    minors = $('.materials .yl.fuliao ul li').map(function() {
        var name = $(this).find("h4 a").text();
        var quantity = $(this).find("span").text();
        return {
            name : name,
            quantity : quantity
        };
    }).toArray();



    return {
        favs: $("span.favbtns #f_num").html(),
        tags: $("ul.pathstlye1 li:last a.curzt").map(function(){
            return ($(this).text());
        }).toArray(),
        materials: {
            mayors: mayors,
            minors: minors
        }
    }
};

let url = encodeURI(`http://www.meishij.net/zuofa/nanguadoushatusi_1.html`);
const scripts = ["https://cdn.bootcss.com/jquery/1.12.4/jquery.js"];
const userAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36`;
crawl({exec, url, scripts, userAgent}).then(data => {
    console.log(data);
}).catch(err => console.log(err));


