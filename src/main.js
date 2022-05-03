/**
 * It is a utility program which organizes files of a given folder
 * based on their extension
 * Test - "C:\Users\Roshan yadav\Downloads"
 * Task - 
 *  Help function -  Provide detais about all the commands
 *  List function -  list all the file in the directory
 *  Organise function - Organises all the files from a source directory to oraganise file directory
 */

const fs = require("fs");

const {help} = require("./help");
const {list} = require("./list");
const {organise} = require("./organise");


let cmdInput = process.argv.slice(2);

switch(cmdInput[0]){
    case "Help":
        // console.log("help : ",help);
        help();
        break;
    case "Organise":
        try{
            let directoryPath = cmdInput[1];
            console.log("executing Organise section with directory path : ",directoryPath);
            organise(directoryPath); 
        }
        catch(err){
            console.error(err);
        }
        break;
    case "List":
        try{
            let directoryPath = cmdInput[1];
            list(directoryPath);
        }catch(err){
            console.error(err);
        }
        break;
    default:
        console.log("🙌 Please provide valid command in input");
}