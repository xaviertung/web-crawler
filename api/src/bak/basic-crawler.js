const async = require('async');
const Promise  = require('bluebird');
const request = require('request');
const cheerio = require('cheerio');

function crawl(options) {
    return new Promise((resolve, reject) => {
        const { urls, exec, limit=5, timeout=2 } = options;
        const delay = parseInt((Math.random() * 10000000) % (timeout * 1000), 10);
        async.mapLimit(urls, limit, function(url, callback) {
            setTimeout(() => {
                request.get(url, function(err, result) {
                    const $ = cheerio.load(result.body);
                    exec($, callback);
                });
            }, delay);
        }, function(err, result) {
            if(!err) {
                resolve(result);
            } else {
                reject(err);
            }
        })
    })
}

module.exports = crawl;