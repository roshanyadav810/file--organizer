const fs = require('fs');
const path = require('path');


let checkWhetherFileOrNot = (destPath,callback)=>{
    fs.stat(destPath,(err , stats)=>{
        if(err){
            callback(err);
        }
        else{
            callback(null ,stats.isFile());
        }
    })
};

let checkIfFolderExistsAndMakeFolderIfNotExists = (destPath , callback)=>{
    fs.access(destPath,(err)=>{
        if(err){
            fs.mkdir(destPath,(err,result)=>{
                if(err){
                    callback(err);
                }
                else{
                    callback(null,"Done");
                }
            });
        }
        else{
            callback(null,"Done");
        }
    });
};

let checkIfFileExistsAndCopyFileIfNotExists = (srcPath, destPath, callback)=>{
    fs.access(destPath,(err)=>{
        if(err){
            fs.copyFile(srcPath, destPath,(err,result)=>{
                if(err){
                    callback(err);
                }
                else{
                    callback(null,"Done");
                }
            });
        }
        else{
            callback(null,"Done");
        }
    });
};

let copyFilesToOrganiseFolder = (directoryPath,destPath,fileNamesArray,index , callback)=>{
    if(index >= fileNamesArray.length){
        callback(null,"Done");
    }
    else{
        let fileName = fileNamesArray[index];
        let srcPath = path.join(directoryPath,fileName);
        let destFilePath = path.join(destPath,fileName);
        checkIfFileExistsAndCopyFileIfNotExists(srcPath,destFilePath,(err)=>{
            if(err){
                callback(err);
            }
            else{
                copyFilesToOrganiseFolder(directoryPath,destPath,fileNamesArray,++index , callback);
            }
        });
    }
};


let organiseFileAccordingToTheirExtension = (directoryPath, fileOrganizationMap , fileTypeArray , index ,callback)=>{
    
    if(index >= fileTypeArray.length){
        callback(null , "done");
    }
    else{
        let fileType = fileTypeArray[index];
        
        let destPath = path.join(directoryPath,"organise-file",fileType);
        checkIfFolderExistsAndMakeFolderIfNotExists(destPath,(err , res)=>{
            if(err){
                callback(err);
            }
            else{
                let fileNamesArray = fileOrganizationMap.get(fileType);
                let indexOfFileNameArray = 0;
                copyFilesToOrganiseFolder(directoryPath,destPath,fileNamesArray,indexOfFileNameArray , (err)=>{
                    if(err){
                        callback(err);
                    }
                    else{
                        organiseFileAccordingToTheirExtension(directoryPath, fileOrganizationMap , fileTypeArray , ++index ,callback);
                    }
                });
            }
        });

    }
}


let getFileNameMap = (directoryPath,folderDataList, index , fileOrganizationMap, callback)=>{
    console.log("getFileNameMap called with index : ",index," , folderDataList length : ",folderDataList.length);
    if(index >= folderDataList.length){
        callback(null,fileOrganizationMap);
    }
    else{
        let data = folderDataList[index];
        let dataPath = path.join(directoryPath,data);
        console.log("3-a");
        checkWhetherFileOrNot(dataPath,(err , isFile)=>{
            console.log("checkWhetherFileOrNot called with err : ",err," , isFile : ",isFile);
            if(err){
                callback("Error while checking path of file");
            }
            else{
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
                getFileNameMap(directoryPath,folderDataList, ++index , fileOrganizationMap, callback)
            }
        });                
    }

};

let organise = function(directoryPath , callback){
    if(directoryPath == undefined){
        callback("directory path is not defined");
    }
    else{
        console.log("step 1");
        fs.access(directoryPath,(err)=>{
            if(err){
                callback("File does not exists");
            }
            else{
                console.log("step 2");
                fs.readdir(directoryPath,(err , folderDataList)=>{
                    if(err){
                        callback("Error while reading the directory");
                    }
                    else{
                        console.log("step 3");
                        let fileOrganizationMap = new Map();
                        let indexOfFolderDataArray = 0;
                        getFileNameMap(directoryPath,folderDataList, indexOfFolderDataArray , fileOrganizationMap, (err , fileOrganizationMap)=>{
                            if(err){
                                callback(err);
                            }
                            else{
                                console.log("step 4");
                                console.log("file oragnization map : ",fileOrganizationMap);
                                if(fileOrganizationMap.size > 0){
                                    let destDirectoryPath = path.join(directoryPath,"organise-file");
                                    checkIfFolderExistsAndMakeFolderIfNotExists(destDirectoryPath,(err,res)=>{
                                        if(err){
                                            callback(err);
                                        }
                                        else{
                                            console.log("step 5");
                                            let fileTypeArray = Array.from(fileOrganizationMap.keys());
                                            let indexOfFileType = 0;
                                            organiseFileAccordingToTheirExtension(directoryPath, fileOrganizationMap , fileTypeArray , indexOfFileType ,()=>{
                                                if(err){
                                                    callback(err);
                                                }
                                                else{
                                                    console.log(`-------
                                                                        completed coping process
                                                                                            -----------------`);
                                                    callback(null , "Successfully organised the files");
                                                }
                                            });
                                        }
                                    });
                                        
                                }
                                
                            }
                        });
                    }
                });
            }
        });
        //let isExists = fs.existsSync(directoryPath);
        // if(isExists){
        //     let folderDataList = fs.readdirSync(directoryPath);
        //     let fileOrganizationMap = new Map();
            

        //     for(let data of folderDataList){
        //         let dataPath = path.join(directoryPath,data);
        //         if(fs.statSync(dataPath).isFile()){
        //             let fileFormat = path.extname(data).slice(1);
        //             fileFormat = fileFormat.toLowerCase();
        //             if(fileOrganizationMap.has(fileFormat)){
        //                 fileOrganizationMap.get(fileFormat).push(data);
        //             }
        //             else{
        //                 fileOrganizationMap.set(fileFormat,[data]);
        //             }
        //         }
        //     }
        //     console.log("file oragnization map : ",fileOrganizationMap);
        //     if(fileOrganizationMap.size > 0){
        //         let destDirectoryPath = path.join(directoryPath,"organise-file");
        //         if(!(fs.existsSync(destDirectoryPath))){
        //             fs.mkdirSync(destDirectoryPath);
        //         }
                
        //         fileOrganizationMap.forEach((fileNamesArray , fileType)=>{
        //             // console.log("file?type : ",fileType);
        //             // console.log(fileNamesArray);
        //             let destPath = path.join(directoryPath,"organise-file",fileType);
        //             if(!(fs.existsSync(destPath))){
        //                 fs.mkdirSync(destPath);
        //             }
        //             for(let fileName of fileNamesArray){
        //                 let srcPath = path.join(directoryPath,fileName);
        //                 let destFilePath = path.join(destPath,fileName);
        //                 // console.log(srcPath , destFilePath);
        //                 if(!(fs.existsSync(destFilePath))){
        //                     fs.copyFileSync(srcPath,destFilePath);
        //                 }
        //             }
                    
        //         })
                    
        //     }
        // }
        // else{
        //     throw new Error("directory does not exists");
        // }
    }
    
};

exports.organise = organise;