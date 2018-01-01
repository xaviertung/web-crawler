const str = "共50页，到第  页 ";
const regExp = /共(.*?)页/;
console.log(str.match(regExp)[1])
console.log(regExp.exec(str))