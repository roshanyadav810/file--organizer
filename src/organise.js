const fs = require('fs');
const path = require('path');


let organise = function(directoryPath){
    if(directoryPath == undefined){
        throw new Error(" directory path is not defined");
    }
    else{
        let isExists = fs.existsSync(directoryPath);
        if(isExists){
            let folderDataList = fs.readdirSync(directoryPath);
            let fileOrganizationMap = new Map();
            

            for(let data of folderDataList){
                let dataPath = path.join(directoryPath,data);
                if(fs.statSync(dataPath).isFile()){
                    let fileFormat = path.extname(data).slice(1);
                    fileFormat = fileFormat.toLowerCase();
                    if(fileOrganizationMap.has(fileFormat)){
                        fileOrganizationMap.get(fileFormat).push(data);
                    }
                    else{
                        fileOrganizationMap.set(fileFormat,[data]);
                    }
                }
            }
            console.log("file oragnization map : ",fileOrganizationMap);
            if(fileOrganizationMap.size > 0){
                let destDirectoryPath = path.join(directoryPath,"organise-file");
                if(!(fs.existsSync(destDirectoryPath))){
                    fs.mkdirSync(destDirectoryPath);
                }
                
                fileOrganizationMap.forEach((fileNamesArray , fileType)=>{
                    // console.log("file?type : ",fileType);
                    // console.log(fileNamesArray);
                    let destPath = path.join(directoryPath,"organise-file",fileType);
                    if(!(fs.existsSync(destPath))){
                        fs.mkdirSync(destPath);
                    }
                    for(let fileName of fileNamesArray){
                        let srcPath = path.join(directoryPath,fileName);
                        let destFilePath = path.join(destPath,fileName);
                        // console.log(srcPath , destFilePath);
                        if(!(fs.existsSync(destFilePath))){
                            fs.copyFileSync(srcPath,destFilePath);
                        }
                    }
                    
                })
                    
            }
        }
        else{
            throw new Error("directory does not exists");
        }
    }
    console.log(`-------
                        completed coping process
                                                -----------------`);
};

exports.organise = organise;