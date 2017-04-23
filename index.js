"use strict";

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const inquirer = require("inquirer-promise");
const glob = require("fast-glob");

const appRoot = path.resolve(__dirname);

let question = require("./conf.js");
let askQuestion = require("./functions/ask.js");

let templates = [];
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
          `models is set up correctly but paternator don't find any files to the path you indicate : ${projectPath}${apackage.paternator.path}. default models will be used instead.`
        );
        askQuestion(path_config, files);
      } else {
        requireFiles(apackage.paternator.models);

        //files = require(`${projectPath}${apackage.paternator.models}`);
      }
    } else {
      takeDefault(
        `miss some params into your package.json. models and path are both required. see documentation online for a better use.`
      );
      askQuestion(path_config, files);
    }
  }
}

// try to find conf.paternator.json
function checkGlob() {
  glob("**/?(conf.paternator.json)", { cwd: projectPath }).then(listFiles => {
    if (listFiles.length > 0) {
      const conf_file = require(`${projectPath}${listFiles[0]}`);
      path_config = `${projectPath}${conf_file.paternator.path}`;
      requireFiles(conf_file.paternator.models);
    } else {
      takeDefault(
        `Paternator is not defined into your project package, and no conf.paternator.json have been found. Default settings are use. See documentation for further informations.`
      );
      askQuestion(path_config, files);
    }
  });
}

function requireFiles(models) {
  if (typeof models === "object") {
    for (let model in models) {
      if (!fs.existsSync(`${projectPath}${models[model]}`)) {
        takeDefault(
          `models is set up correctly but paternator don't find any files to the path you indicate : ${projectPath}${models[model]}. default models will be used instead.`
        );
        askQuestion(path_config, files);
        return;
      } else {
        templates[model] = { value: "", name: "" };
        templates[model].value = require(`${projectPath}${models[model]}`);
        if (templates[model].value.templateName) {
          templates[model].name = templates[model].value.templateName;
        } else {
          templates[model].name = models[model];
        }
      }
    }

    inquirer
      .prompt([
        {
          type: "list",
          name: "pattern",
          message: "Choose what template you want to duplicate.",
          choices: templates
        }
      ])
      .then(function(choosen) {
        files = choosen.pattern;
        askQuestion(path_config, files);
      });

    // If only one patern
  } else if (typeof models === "string") {
    files = require(`${projectPath}${models}`);
    askQuestion(path_config, files);
  }
}
