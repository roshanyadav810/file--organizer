const help = (callback)=>{
    console.log(`
        😎 see the description below
            1. list : list all files in a directory.
            2. organise : organizes all the files of a directory based on their extension.
    `);
    callback(null , "done");
};

exports.help = help;