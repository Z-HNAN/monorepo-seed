const fse = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const { getAllAppsDir } = require('./utils');

; (async () => {
  console.log('will fix all subProject modify package.json to add "name", "version", "private"');

  const appsDir = getAllAppsDir();

  appsDir.forEach(dir => {
    const pkg = fse.readJSONSync(path.join(dir, './package.json'), { encoding: 'utf-8' })

    if (!pkg.name || !pkg.version) {
      pkg.name = path.basename(dir)
      pkg.version = pkg.version ? pkg.version : '1.0.0'
      pkg.private = true

      fse.writeJSONSync(path.join(dir, './package.json'), pkg, { encoding: 'utf-8', spaces: 2 })
      console.log(chalk.green(`fix ${pkg.name}`));
    }


  })

})()