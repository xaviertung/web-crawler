const async = require('async');
const ObjectID = require('mongodb').ObjectID;

const Tasks = require('../schemas/tasks');
const Steps = require('../schemas/steps');
const Results = require('../schemas/results');

const requestCrawler = require('./request-crawler');
const phantomCrawler = require('./phantom-crawler');


const q = async.queue(function (obj, cb) {
    const currentStep = obj.steps[obj.stepIndex];
    const { urls, exec, mode=1, _id } = currentStep;
    async.mapLimit(urls, 5, function(step, callback) {
        const { path, timer=2 } = step;
        const delay = parseInt((Math.random() * 10000000) % (timer * 1000), 10);
        setTimeout(async function () {
            let returnValue;
            if(mode == 1) {
                returnValue = await requestCrawler({ url: path, exec })
            } else {
                returnValue = await phantomCrawler({ url: path, exec })
            }
            const _newStep = await Steps.findOne({ _id }).populate("results").exec();
            const currentResultScheme = new Results({
                stepId: _newStep,
                url: path, 
                content: returnValue.data
            });
            const savedResult = await currentResultScheme.save();
            // const _newStep = await Steps.findOneAndUpdate({ _id }, { $set : { results: savedResult }}, { new : true }).populate("result").exec();
            // const _newStep = await Steps.findOne({ _id }).populate("results").exec();
            _newStep.results.push(savedResult);
            _newStep.save();
            callback(null, {
                taskId: obj._id,
                stepId: _id,
                stepIndex: obj.stepIndex,
                stepCounter: obj.steps.length
            })
        　　
        },delay)
    }, async (err, results) => {
        if (err) throw err
        const { taskId, stepId, stepIndex, stepCounter } = results[0];
        await Steps.findOneAndUpdate({ _id: stepId }, { $set : { completed: true }});
        if(stepIndex < stepCounter-1) {
            const _obj = await Tasks.findOneAndUpdate({ _id: taskId}, { $set : { stepIndex: stepIndex+1}}, { new : true }).populate("steps").exec();
            q.push(_obj)
        } else {
            const _obj = await Tasks.findOne({ _id: taskId}).populate("steps").exec();
            let completed = true;
            for(let step of _obj.steps) {
                if(!step.completed) {
                    completed = false;
                    break;
                }
            }
            _obj.completed = completed;
            _obj.save();
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