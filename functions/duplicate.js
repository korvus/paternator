const fs = require("fs");
const chalk = require("chalk");

const duplicateFiles = function(pathfolder, componentName, files) {
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
        if (fs.existsSync(`${tempPath}/${itemsPath[stepDirectory]}`)) {
          console.warn(
            chalk.red.bold(`ERROR`),
            chalk.white.bold(`: This chunk already exist.`)
          );
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
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = duplicateFiles;
