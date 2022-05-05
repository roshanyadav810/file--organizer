const fs = require('fs/promises');
const fsOld = require('fs');
const path = require('path');
const util =  require('util');

const accessFile = util.promisify(fsOld.access);

let organise = async(directoryPath , callback)=>{
    try{
        if(directoryPath == undefined){
            throw new Error("Directory path is not provided");
        }
        else{
            await accessFile(directoryPath);
            let folderDataList =  await fs.readdir(directoryPath);

            let fileOrganizationMap = new Map();

            for(let data of folderDataList){
                let dataPath = path.join(directoryPath,data);
                let isFile = (await fs.stat(dataPath)).isFile();
                if(isFile){
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
            if(fileOrganizationMap.size > 0){
                let destDirectoryPath = path.join(directoryPath,"organise-file");
                try{
                    await accessFile(destDirectoryPath);
                }
                catch(err){
                    if(err.code === "ENOENT"){
                        await fs.mkdir(destDirectoryPath);
                    }
                    else{
                        throw err;
                        return;
                    }
                }
                
                let keys = Array.from(fileOrganizationMap.keys());
                for(let fileType of keys){
                    let fileNamesArray = fileOrganizationMap.get(fileType);
                    // console.log("file?type : ",fileType);
                    // console.log(fileNamesArray);
                    let destPath = path.join(directoryPath,"organise-file",fileType);
                    try{
                        await accessFile(destPath);
                    }
                    catch(err){
                        if(err.code === "ENOENT"){
                            await fs.mkdir(destPath);
                        }
                        else{
                            throw err;
                            return;
                        }
                    }
                    for(let fileName of fileNamesArray){
                        let srcPath = path.join(directoryPath,fileName);
                        let destFilePath = path.join(destPath,fileName);
                        try{
                            await accessFile(destFilePath);
                        }
                        catch(err){
                            if(err.code === "ENOENT"){
                                await fs.copyFile(srcPath,destFilePath);
                            }
                            else{
                                throw err;
                                return;
                            }
                        }
                        
                    }
                    
                }
                    
            }

        }
    }
    catch(err){
        throw err;
        return;
    }
    
};

exports.organise = organise;