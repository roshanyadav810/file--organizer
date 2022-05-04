const directoryTree = require('directory-tree');

let list = (directoryPath , callback)=>{
    if(directoryPath === undefined){
        // throw new Error("Not a valid directory path");
        callback("Not a valid directory path");
    }
    else{
        console.log(directoryTree(directoryPath));
        callback(null,"successfully shown directory");
    }
};

exports.list = list;