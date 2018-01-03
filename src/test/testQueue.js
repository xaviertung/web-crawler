const Promise = require('bluebird');
const mongoose = require('../utils/db-utils');
const Tasks = require('../schemas/tasks');
const Steps = require('../schemas/steps');
const crawler = require('../crawlers');




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

const testTask = async (steps) => {

    const tasks1 = new Tasks({
    });

    

    if(steps.length>0) {
        const task = await tasks1.save();

        const stepSchemas = steps.map(async (step) => {
            const currentStepSchema = new Steps(step);
            currentStepSchema.taskId = task;
            return await currentStepSchema.save();
        });

        for(let step of stepSchemas) {
            task.steps.push(await step);
        }
        
        const _task = await task.save();
        crawler.push(await Tasks.populate(_task, { path: "steps"}))
    }


}

module.exports = testTask;