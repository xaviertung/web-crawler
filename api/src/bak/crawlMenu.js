const { find, remove } = require('./mongo-utils');
const crawl = require('../crawlers/basic-crawler');

find({multiple:true, collection:"menuUrls"}).then(result => {
    find({
        multiple: false, 
        collection:"menuUrls",
        projection: {url:1, _id:1}
    }).then(result => {
        


        const options = {
            urls : urls,
            exec : function($, callback) {

                const materials = {};
                const title = $('#tongji_title').eq(0).text();
                materials["title"] = title;
            
                const mayors = [], minors = [];
            
                $('.materials .yl.zl ul li .c h4').map((i, el) => {
                    const name = $(el).find("a").text();
                    const quantity = $(el).find("span").text();
                    mayors.push({
                        name,
                        quantity
                    });
                });
                materials["mayors"] = mayors;
                const minor = $('.materials .yl.fuliao ul li').map((i, el) => {
                    const name = $(el).find("h4 a").text();
                    const quantity = $(el).find("span").text();
                    minors.push({
                        name,
                        quantity
                    });
                });
                materials["minors"] = minors;

                callback(null, materials);
            }
        };

    })
});
