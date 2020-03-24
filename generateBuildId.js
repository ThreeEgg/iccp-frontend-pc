const moment = require('moment');

module.exports = () => {
  const pkg = require('./package.json');
  const buildTime = moment().format('YYYYMMDDHHmm');

  let gitCommitCount = process.env.GIT_VERSION || 0;

  const buildId = `${process.env.NODE_ENV || 'development'}_${
    pkg.version
  }_${gitCommitCount}_${buildTime}`;

  return buildId;
};
