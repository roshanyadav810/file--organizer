const directoryTree = require('directory-tree');

let list = (directoryPath)=>{
    if(directoryPath === undefined){
        throw new Error("Not a valid directory path");
    }
    else{
        console.log(directoryTree(directoryPath));
    }
};

exports.list = list;