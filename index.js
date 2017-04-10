const fs = require('fs');
const path = require('path')
const inquirer = require('inquirer');

var question = require('./conf.js');

function takeDefault(warningMssg){
	console.log(`WARNING : ${warningMssg}`);
	var files = require('./models/files.js');
	var path_config = question.path;
}

if (!fs.existsSync('../package.json')){
	takeDefault(`there is no package.json into your project. Please verify you installed paternator at good place.`);
}else{
	var apackage = require('../package.json');
	if(!apackage.paternator){
		takeDefault(`missing infos into your package json.`);
	}else{
		if(apackage.paternator.path && apackage.paternator.models){
			var path_config = `../${apackage.paternator.path}`;
			var files = require(`../${apackage.paternator.models}`);
		}else{
			takeDefault(`miss some info to your files.`);
		}
	}
}


inquirer.prompt(question.conf).then(function (answers) {
  if (!fs.existsSync(path_config)){
    console.warn(`Your path ${path_config} doesn't exist !`);
  }
  var folder = `${path_config}/${answers.component_name}`;
  if (!fs.existsSync(folder)){
  	fs.mkdirSync(folder);
  	duplicateFiles(folder, answers.component_name);
  }else{
  	console.warn(`a component have already this name !`);
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