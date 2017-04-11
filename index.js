const fs = require('fs');
const path = require('path')
const inquirer = require('inquirer-promise');
const chalk = require('chalk');

let question = require('./conf.js');

let path_config, files, fileName, fileText = "";

function takeDefault(warningMssg){
	console.log(chalk.red.bold(`WARNING`), chalk.white.bold(`: ${warningMssg}`));
	files = require('./models/files.js');
	path_config = question.path;
}

if (!fs.existsSync('../../package.json')){
	takeDefault(`there is no package.json at the root of your project. Please verify you installed paternator at good place.`);
    process.exit();
}else{
	let apackage = require('../../package.json');
	if(!apackage.paternator){
		takeDefault(`Paternator is not defined into your project package.`);
	}else{
		if(apackage.paternator.path && apackage.paternator.models){
			path_config = `../../${apackage.paternator.path}`;
			files = require(`../../${apackage.paternator.models}`);
		}else{
			takeDefault(`miss some infos into your package.json.`);
		}
	}
}

inquirer.prompt(question.conf).then(function (answers) {
  if (!fs.existsSync(`../..${path_config}`)){
    console.log(chalk.yellow.bold(`seem you didn't configured where to create files. ${path_config} don't exist, it will be automatically create !`));
  }
  let directory = `${path_config}/${answers.component_name}`;
  if (!fs.existsSync(directory)){

    fs.mkdirSync(directory);

  	duplicateFiles(directory, answers.component_name);
  }else{
  	console.log(chalk.red.bold(`a component have already this name !`));
    process.exit();
  }
});

function duplicateFiles(pathfolder, componentName){

	console.log(files);
	for(let file in files) {

	    var Componentname = capitalizeFirstLetter(componentName);

		var fileName = files[file][0].replace(/\[name\]/gi, componentName);
		fileText = files[file][1].replace(/\[name\]/gi, componentName);
	    //with capital on first letter
	    fileText = files[file][1].replace(/\[Name\]/gi, Componentname);

		// On écrit le fichier
		fs.writeFile(`${pathfolder}/${fileName}`, fileText, function(err) {
		    if(err) {
		        return console.log(err);
		    }
		    console.log(`${file} created`);
		});

	}
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
