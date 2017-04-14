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
			if(!fs.existsSync(`${projectPath}${apackage.paternator.path}`)){
				takeDefault(`models is set up correctly in package.json but paternator don't find any files in the path you indicate : ${projectPath}${apackage.paternator.path}. default models will be used.`);
			}else{
				files = require(`${projectPath}${apackage.paternator.models}`);
			}
		}else{
			takeDefault(`miss some params into your package.json. models and path are both required. see documentation online for a better use.`);
		}
	}
}

inquirer.prompt(question.conf).then(function (answers) {

  let directory = `${path_config}`;
  duplicateFiles(directory, answers.component_name);

});

function duplicateFiles(pathfolder, componentName){

	for(let file in files) {

	    let Componentname = capitalizeFirstLetter(componentName);

		let fileName = files[file][0].replace(/\[name\]/gi, componentName);
		fileText = files[file][1].replace(/\[name\]/gi, componentName);
	    //with capital on first letter
	    fileText = files[file][1].replace(/\[Name\]/gi, Componentname);

	    itemsPath = fileName.split("/");
	    let deepPath = itemsPath.length;

	    let tempPath = `${pathfolder}`;

	    for(let stepDirectory in itemsPath) {

	    	//If last part of the queue
	    	if(parseInt(stepDirectory)===(parseInt(itemsPath.length)-1)) {

	    		// Create file

	    		fs.writeFile(`${tempPath}/${itemsPath[stepDirectory]}`, fileText, function(err) {
		    		if(err) {
		        		return console.error(err);
		    		}
		    		console.info(`${file} created`);
				});

	    	} else {

	    		tempPath = `${tempPath}/${itemsPath[stepDirectory]}`;

	    		//Create folders
		    	if (!fs.existsSync(tempPath)) {
		    		fs.mkdirSync(tempPath);
		    	}

	    	}

	    }

	}
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
