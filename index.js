const fs = require('fs');
const path = require('path')
const inquirer = require('inquirer-promise');
const chalk = require('chalk');

const appRoot = path.resolve(__dirname);

let question = require('./conf.js');

let path_config, files, fileName, fileText = "";

projectPath = appRoot+'/../../';

function takeDefault(warningMssg){
	console.warn(chalk.red.bold(`WARNING`), chalk.white.bold(`: ${warningMssg}`));
	files = require(`${appRoot}/models/files.js`);
	path_config = projectPath+question.path;
}


if (!fs.existsSync(`${projectPath}package.json`)){
	takeDefault(`there is no package.json at the root of your project. Please verify you installed paternator at good place.`);
    process.exit();
}else{
	let apackage = require(`${projectPath}package.json`);
	if(!apackage.paternator){
		takeDefault(`Paternator is not defined into your project package.`);
	}else{
		if(apackage.paternator.path && apackage.paternator.models){
			path_config = `${projectPath}${apackage.paternator.path}`;
			files = require(`${projectPath}${apackage.paternator.models}`);
		}else{
			takeDefault(`miss some params into your package.json. models and path are both required. see documentation online for a better use.`);
		}
	}
}

inquirer.prompt(question.conf).then(function (answers) {
  if (!fs.existsSync(path_config)){
    console.warn(chalk.yellow.bold(`seem you didn't configured where to create files. ${path_config} don't exist, it will be automatically create !`));
  }
  let directory = `${path_config}/${answers.component_name}`;
  if (!fs.existsSync(directory)){

    fs.mkdirSync(directory);

  	duplicateFiles(directory, answers.component_name);
  }else{
  	console.error(chalk.red.bold(`a component have already this name !`));
    process.exit();
  }
});

function duplicateFiles(pathfolder, componentName){

	for(let file in files) {

	    var Componentname = capitalizeFirstLetter(componentName);

		var fileName = files[file][0].replace(/\[name\]/gi, componentName);
		fileText = files[file][1].replace(/\[name\]/gi, componentName);
	    //with capital on first letter
	    fileText = files[file][1].replace(/\[Name\]/gi, Componentname);

		// On écrit le fichier
		fs.writeFile(`${pathfolder}/${fileName}`, fileText, function(err) {
		    if(err) {
		        return console.error(err);
		    }
		    console.info(`${file} created`);
		});

	}
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
