const fs = require('fs');
const path = require('path')
const inquirer = require('inquirer-promise');
const chalk = require('chalk');

var question = require('./conf.js');
var path_config = "";
var files = ""

function takeDefault(warningMssg){
	console.log(chalk.red.bold(`WARNING`), chalk.white.bold(`: ${warningMssg}`));
	files = require('./models/files.js');
	path_config = question.path;
}

if (!fs.existsSync('../../package.json')){
	takeDefault(`there is no package.json into your project. Please verify you installed paternator at good place.`);
    process.exit();
}else{
	var apackage = require('../../package.json');
	if(!apackage.paternator){
		takeDefault(`Paternator is not defined into your project package.`);
	}else{
		if(apackage.paternator.path && apackage.paternator.models){
			path_config = `../../${apackage.paternator.path}`;
			files = require(`../../${apackage.paternator.models}`);
		}else{
			takeDefault(`miss some info to your files.`);
		}
	}
}

var inquireromise = inquirer.prompt(question.conf).then(function (answers) {
  if (!fs.existsSync(`../..${path_config}`)){
    takeDefault(`seem you didn't configured where to create files. ${path_config} don't exist, it will be automatically create !`);
  }
  var folder = `../..${path_config}/${answers.component_name}`;
  if (!fs.existsSync(folder)){

    fs.mkdirSync(folder);

  	duplicateFiles(folder, answers.component_name);
  }else{
  	takeDefault(`a component have already this name !`);
    process.exit();
  }
});

function duplicateFiles(pathfolder, componentName){

	for(var file in files) {

    var Componentname = capitalizeFirstLetter(componentName);

		var fileName = files[file][0].replace(/\[name\]/gi, componentName);
		var fileText = files[file][1].replace(/\[name\]/gi, componentName);
    //with capital on first letter
    var fileText = files[file][1].replace(/\[Name\]/gi, Componentname);

		// On écrit le fichier
		fs.writeFile(`${pathfolder}/${fileName}`, fileText, function(err) {
		    if(err) {
		        return console.log(err);
		    }
		    console.log(`file created`);
		});

	}
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
