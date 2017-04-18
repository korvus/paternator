# README #

Allow to create easily a component automatically inside a react architecture, or any javascript package project.

## Installation

```
npm install paternator -D
```

__-D is for dev dependencies.__


## setup paternator

You got two choices.
- 1 Into your package.json file, from your project:

```javascript
  "paternator": {
    "models": "models/files.js",
    "path": "app/"
  },
```
This usage is much faster, prefer it.

- 2 Inside a json in your project, named ``conf.paternator.json``
```json
{
	"paternator": {
		"models": "models/files.js",
		"path": "app/"
	}
}
```


models : (string) path to the special file (see bellow) wich contains all the files to duplicate.

path : (string) folder path where all the patern will be duplicate

## files.js (models)

files.js contain a kind of "map" / "plan" of the files you want to generate automatically.

It's a json object, where each json will be the future files.

Each json object have two parts, both are strings. First is the name of the futur file, second its content.

Example :

```javascript
exports.entrance = ['index.js',`
import React from 'react';
import s from './[name].css';

const [Name] = ({ id }) => (
  <div>
  </div>
);

[Name].propTypes = {
  id: React.PropTypes.number.isRequired,
};

export default [Name];
`];

exports.index = ['[name].css',`
	body{background: #fff;}
`];
```
This example generate two files, one js file and a css file. The CSS file will have the component name.

## Use

When you will duplicate the package by CLI, component's name will be asked. From that, a folder with the component's name will be generate automatically to your folder target. Inside this folder, you will found all the files you set up in your models.

I invite to make a npm script shortcut for a better use.
```json
  "scripts": {
    "paternator": "node node_modules/paternator"
  },
```

## resources

https://github.com/korvus/paternator