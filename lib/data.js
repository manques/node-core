/*
    Library for storing and editing data
*/

// Dependencies
const fs = require('fs');
const path = require('path');
const jsonService = require('../services/json-service');

// container for the module ( to be exported)

const lib = {};

// base directory for the data folder
lib.baseDir = path.join(__dirname, '/../.data');


// write data to a file
lib.create = (dir, file, data, callback) => {
    if(!fs.existsSync(`${lib.baseDir}/${dir}`)){
        fs.mkdirSync(`${lib.baseDir}/${dir}`);
    }
    console.log(`${lib.baseDir}/${dir}/${file}.json`);
    // open file for writing
    fs.open(`${lib.baseDir}/${dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
        if(!err && fileDescriptor){
             // Convert data to string
             const stringData = jsonService.objectToJson(data);
             // write file and close it
             fs.writeFile(fileDescriptor, stringData, err => {
                 if(err){
                     callback('err writing to new file!!');
                 }else {
                     fs.close(fileDescriptor, err => {
                         if(err){
                             callback('error closing new file!');
                         }else {
                             callback(false);
                         }
                     });
                 }
             });
           
        }else {
            callback('could not create file, it may already exists');
        }
    });
}

// read data inside the file
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.baseDir}/${dir}/${file}.json`, 'utf-8', (err, data) => {
        if(!err && data) {
            callback(false, jsonService.jsonToObject(data));
        } else {
            callback('no file exist', null);
        }
    });
}

// update data to file
lib.update = (dir, file, data, callback) => {
    // open file for writing
    fs.open(`${lib.baseDir}/${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        console.log('file descriptor '+fileDescriptor);
        if(!err && fileDescriptor) {
            // convert data to string
            const stringData = jsonService.objectToJson(data);
            // truncate the file
            fs.ftruncate(fileDescriptor, err => {
                console.log(err);
                if(!err){
                    // write file and close it
                    fs.writeFile(fileDescriptor, stringData, err => {
                        if(!err) {
                            // close file
                            fs.close(fileDescriptor, err => {
                                if(!err){
                                    callback(false);
                                } else {
                                    callback('Error closing file!');
                                }
                            });
                        } else {
                            callback('Error writing to existing file!!');
                        }
                    });
                } else {
                    callback('Error truncate file!');
                }
            });
        }else {
            callback('Could not create new file, it may already exist!');
        }
    });
}

// delete the file
lib.delete = (dir, file, callback) => {
    fs.unlink(`${lib.baseDir}/${dir}/${file}.json`, err => {
        if(!err){
            callback(false);
        } else {
            callback('Error delete file!!');
        }
    });
}

module.exports = lib;




// TESTING
// @ TODO test this
// _data.create('test', 'newFile', { data: 'test'}, err => {
//     console.log('this was the error', err);
// });

// read file
// _data.read('test', 'newFile', (err, data) => {
//     console.log('err '+err+' ' +'data'+data);
// });
// update file
// _data.update('test', 'newFile', { data: 'yooxoo'}, (err) => {
//     console.log(`this was the error `+err);
// });

// delete file
// _data.delete('test', 'newFile', err => {
//     console.log('this was the error ' + err);
// });