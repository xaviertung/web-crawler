const async = require('async');
const ObjectID = require('mongodb').ObjectID;
const request = require('request-promise');
const cheerio = require('cheerio');
const phantom = require('phantom');
const Tasks = require('../schemas/tasks');


const _userAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36`;

const crawlByDefault = async({ url, exec }) => {
    const result = await request.get(url);
    // console.log(result)
    const $ = cheerio.load(result); 
    var body = {};
    eval(exec)
    return body;
}
const crawlByPhantom = async ({ url, exec, scripts=["https://cdn.bootcss.com/jquery/1.12.4/jquery.js"], userAgent=_userAgent }) => {
    console.log('phantom:', url)
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


const q = async.queue(function (obj, cb) {
    const currentStep = obj.steps[obj.stepIndex];
    const { urls, exec, mode=1 } = currentStep;
    async.mapLimit(urls, 5, function(step, callback) {
        const { path, timer=2 } = step;
        const delay = parseInt((Math.random() * 10000000) % (timer * 1000), 10);
        setTimeout(async function () {
            let returnValue;
            if(mode == 1) {
                returnValue = await crawlByDefault({ url: path, exec })
            } else {
                returnValue = await crawlByPhantom({ url: path, exec })
            }
            console.log(returnValue)
            callback(null, {
                taskId: obj._id,
                stepIndex: obj.stepIndex,
                stepCounter: obj.steps.length
            })
        　　
        },delay)
    }, async (err, results) => {
        if (err) throw err
        const { taskId, stepIndex, stepCounter } = results[0];
        if(stepIndex < stepCounter-1) {
            const _obj = await Tasks.findOneAndUpdate({ _id: taskId}, { $set : { stepIndex: stepIndex+1}}, { new : true }).populate("steps").exec();
            q.push(JSON.parse(JSON.stringify(_obj)))
        }
        cb();
    })
},2);
    

q.saturated = function() { 
    console.log('all workers to be used'); 
}
q.empty = function() { 
    console.log('no more tasks wating'); 
}
q.drain = function() { 
    console.log('all tasks have been processed'); 
}

module.exports = q;