
exports.entrance = ['[name]/index.js',`
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

exports.index = ['[name]/[name].css',`
`];