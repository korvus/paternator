const fs = require("fs");
const inquirer = require("inquirer-promise");

const question = require("../conf.js");
const duplicate = require("./duplicate.js");

// duplicate function is called in each function, depending of conditions

// Inquirer part
const askQuestion = function(path_config, files) {
  inquirer.prompt(question.conf).then(function(answers) {
    if (!fs.existsSync(path_config)) {
      generateDirectories(
        path_config,
        files,
        path_config,
        answers.component_name
      );
    } else {
      duplicate(path_config, answers.component_name, files);
    }
  });
};

// Generate Directories if need
function generateDirectories(path_config, files, rootPath, paternName) {
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
  duplicate(path_config, paternName, files);
}

module.exports = askQuestion;
