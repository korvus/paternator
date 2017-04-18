"use strict";

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const glob = require("fast-glob");

const appRoot = path.resolve(__dirname);

let question = require("./conf.js");
let askQuestion = require("./functions/ask.js");

let path_config, files, fileName, fileText = "";

let projectPath = appRoot + "/../../";

function takeDefault(warningMssg) {
  console.warn(chalk.red.bold(`WARNING`), chalk.white.bold(`: ${warningMssg}`));
  files = require(`${appRoot}/models/files.js`);
  path_config = projectPath + question.path;
}

// Try to grab conf
if (!fs.existsSync(`${projectPath}package.json`)) {
  takeDefault(
    `there is no package.json at the root of your project. Paternator should be in your nodes_module directory.`
  );
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
      takeDefault(
        `miss some params into your package.json. models and path are both required. see documentation online for a better use.`
      );
    }
    askQuestion(path_config, files);
  }
}

// try to find conf.paternator.json
function checkGlob() {
  glob("**/?(conf.paternator.json)", { cwd: projectPath }).then(listFiles => {
    if (listFiles.length > 0) {
      //console.log(listFiles[0]);
      const conf_file = require(`${projectPath}${listFiles[0]}`);
      path_config = `${projectPath}${conf_file.paternator.path}`;
      files = require(`${projectPath}${conf_file.paternator.models}`);
      askQuestion(path_config, files);
    } else {
      takeDefault(
        `Paternator is not defined into your project package, and no conf.paternator.json have been found. Default settings are use. See documentation for further informations.`
      );
      askQuestion(path_config, files);
    }
  });
}
