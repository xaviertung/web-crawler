const fs = require('fs');
const MenuUrlsSchema = require('../schemas/menuUrls');
const input = fs.readFileSync("./src/menuUrls.bak.json", "utf8");
const out = fs.createWriteStream("./src/menuUrls.bak.new.json");

const arr = eval(input);
const uniqueUrls = {};
for(let obj of arr) {
    
    for(let k in obj) {
        uniqueUrls[k] = obj[k];
    }
}
for(let k in uniqueUrls) {
    const MenuUrls = new MenuUrlsSchema({
        name: k,
        url: uniqueUrls[k]
    });
    MenuUrls.save(function (err, res) {
        if (err) {
            console.log("Error:" + err);
        }
        else {
            // console.log("Res:" + res);
        }
    
    });
}

console.log(Object.keys(uniqueUrls).length);
