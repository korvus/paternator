"use strict";

const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer-promise");
const chalk = require("chalk");
const glob = require("glob")

const appRoot = path.resolve(__dirname);

let question = require("./conf.js");

let path_config, files, fileName, fileText = "";

let projectPath = appRoot + "/../../";

function takeDefault(warningMssg) {
  console.warn(chalk.red.bold(`WARNING`), chalk.white.bold(`: ${warningMssg}`));
  files = require(`${appRoot}/models/files.js`);
  path_config = projectPath + question.path;
}

function checkGlob (){
  glob("../../**/?(conf.paternator.json)", {'nodir':true}, function (er, listFiles) {
    if(listFiles.length>0){
        const conf_file = require(listFiles[0]);
        path_config = `${projectPath}${conf_file.paternator.path}`;
        files = require(`${projectPath}${conf_file.paternator.models}`);
        askQuestion();
      //let question = require("./conf.js");
    }else{
      takeDefault(
      `Paternator is not defined into your project package, and no conf.paternator.json have been found. Default settings are use. See documentation for further informations.`
      );
      askQuestion();
    }
  })
}

if (!fs.existsSync(`${projectPath}package.json`)) {
  takeDefault(`there is no package.json at the root of your project. Paternator should be in your nodes_module directory.`);
  process.exit();
} else {
  let apackage = require(`${projectPath}package.json`);
  if (!apackage.paternator) {
    checkGlob();
  } else {
    if (apackage.paternator.path && apackage.paternator.models) {
      path_config = `${projectPath}${apackage.paternator.path}`;
      if (!fs.existsSync(`${projectPath}${apackage.paternator.path}`)) {
        takeDefault(
          `models is set up correctly in package.json but paternator don't find any files in the path you indicate : ${projectPath}${apackage.paternator.path}. default models will be used.`
        );
      } else {
        files = require(`${projectPath}${apackage.paternator.models}`);
      }
    } else {
      takeDefault(`miss some params into your package.json. models and path are both required. see documentation online for a better use.`);
    }
    askQuestion();
  }
}

function askQuestion(){

  inquirer.prompt(question.conf).then(function(answers) {
    if (!fs.existsSync(path_config)) {
      generateDirectories(path_config, answers.component_name);
    } else {
      duplicateFiles(path_config, answers.component_name);
    }
  });
}

function generateDirectories(rootPath, paternName) {
  console.warn(
    chalk.red.bold(`WARNING`),
    chalk.white.bold(`: destination directory did not exist, it was created.`)
  );
  if (!fs.existsSync(rootPath)) {
    rootPath.split("/").forEach((dir, index, splits) => {
      const parent = splits.slice(0, index).join("/");
      const dirPath = path.resolve(parent, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }
    });
  }
  duplicateFiles(path_config, paternName);
}

function duplicateFiles(pathfolder, componentName) {

  for (let file in files) {
    let Componentname = capitalizeFirstLetter(componentName);

    let fileName = files[file][0].replace(/\[name\]/gi, componentName);
    fileText = files[file][1].replace(/\[name\]/gi, componentName);
    //with capital on first letter
    fileText = files[file][1].replace(/\[Name\]/gi, Componentname);

    //console.log(typeof fileName);
    let itemsPath = fileName.split("/");

    let tempPath = pathfolder;

    for (let stepDirectory in itemsPath) {
      //If last part of the queue
      if (parseInt(stepDirectory) === parseInt(itemsPath.length) - 1) {
        // Create file
        if(fs.existsSync(`${tempPath}/${itemsPath[stepDirectory]}`)){
          console.warn(chalk.red.bold(`ERROR`), chalk.white.bold(`: This chunk already exist.`));
          process.exit();
        }
        fs.writeFile(
          `${tempPath}/${itemsPath[stepDirectory]}`,
          fileText,
          function(err) {
            if (err) {
              return console.error(err);
            }
            console.info(`${file} created`);
          }
        );
      } else {
        tempPath = `${tempPath}/${itemsPath[stepDirectory]}`;

        //Create folders
        if (!fs.existsSync(tempPath)) {
          fs.mkdirSync(tempPath, function(err, folder) {
            if (err) throw err;
          });
        }
      }
    }
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
