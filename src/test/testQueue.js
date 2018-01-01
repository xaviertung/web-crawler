const Promise = require('bluebird');
const mongoose = require('../utils/db-utils');
const Tasks = require('../schemas/tasks');
const Steps = require('../schemas/steps');
const crawlersQueue = require('../crawlers/crawlers-queue');

const tasks1 = new Tasks({
});

const step1 = new Steps({
    urls : [{ path : "http://www.meishij.net", timer: 1 }],
    exec : "body['a']=$('title').text();",
    mode: 2
})

const step2 = new Steps({
    urls : [{ path : "http://www.baidu.com?r=21&userId=1"}, { path : "http://www.baidu.com?r=22&userId=1"}],
    exec : "body['a']=$('title').text();",
    mode: 1
})


const step3 = new Steps({
    urls : [{ path : "http://www.baidu.com?r=31&userId=1"}],
    exec : "body['a']=$('title').text();",
    mode: 1
})


// tasks1.save().then(function(task) {

//         step1.taskId = task;
//         step2.taskId = task;
//         step3.taskId = task;
//         return Promise.all([step1.save(), step2.save(), step3.save(), task ])
        
// }).spread(function(step1, step2, step3, task2) {
        
//     task2.steps.push(step1);
//     task2.steps.push(step2);
//     task2.steps.push(step3);

//     return Promise.all([task2.save()]);

// }).spread(async function(task3) {
//     // console.log(task3)
//     const task21 = await Tasks.findOne({ _id: task3._id}).populate("steps").exec();
//     crawlersQueue.push(JSON.parse(JSON.stringify(task21)))
// }).catch(err => {
//     console.log(err)
// })

tasks1.save().then(async function(task) {

    step1.taskId = task;
    step2.taskId = task;
    step3.taskId = task;
    const _step1 = await step1.save();
    const _step2 = await step2.save();
    const _step3 = await step3.save();

    task.steps.push(_step1);
    task.steps.push(_step2);
    task.steps.push(_step3);
    
    const _task = await task.save();
    
    const task21 = await Tasks.findOne({ _id: _task._id}).populate("steps").exec();
    crawlersQueue.push(JSON.parse(JSON.stringify(task21)))
}).catch(err => {
    console.log(err)
})