const testTask = require('../test/testQueue')

module.exports = app => {
    "use strict";
    /**
     * @api {get} / API Status
     * @apiGroup Status
     * @apiSuccess {String} status API Status' message
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {"status": "NTask API"}
     */
    app.get("/task", (req, res) => {


        const step1 = {
            urls : [{ path : "http://www.meishij.net", timer: 1 }],
            exec : "body[\"a\"]=$(\"title\").text();",
            mode: 2
        };
        
        const step2 = {
            urls : [{ path : "http://www.baidu.com?r=21&userId=1"}, { path : "http://www.baidu.com?r=22&userId=1"}],
            exec : "body['a']=$('title').text();",
            mode: 1
        };
        
        
        const step3 = {
            urls : [{ path : "http://www.baidu.com?r=31&userId=1"}],
            exec : "body['a']=$('title').text();",
            mode: 1
        };

        const steps = [];
        steps.push(step1);
        steps.push(step2);
        steps.push(step3);


        testTask(steps).then((data) => {
            res.json({status: "NTask API"});
        }).catch(err => console.log(err));
        
    });
};