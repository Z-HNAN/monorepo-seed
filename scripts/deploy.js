const fse = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const inquirer = require('inquirer');
const chalk = require('chalk');

const { getAllAppsName } = require('./utils');

; (async () => {
  const appsName = getAllAppsName()
  if (appsName.length === 0) {
    console.log(chalk.yellow('no project can be build. (please add "name", "version" in subProject \'s package.json)'));
    process.exit(0)
  }

  const { name: subProjectName } = await inquirer.prompt({
    type: 'list',
    name: 'name',
    message: 'select app to build',
    choices: appsName,
  })
  const subProjectRoot = path.resolve(__dirname, '../packages/', subProjectName);

  const buildDirOrder = ['build', 'dist', 'output'].map(d => path.join(subProjectRoot, d))
  const distSubProject = path.resolve(__dirname, '../dist', subProjectName)

  console.log(chalk.green('[1/3: BUILD]'));
  buildDirOrder.map(d => fse.removeSync(d))
  execSync(`yarn workspace ${subProjectName} build`, { stdio: 'inherit' })

  console.log(chalk.green('[2/3: ADD DIST]'));
  fse.ensureDir(distSubProject)
  buildDirOrder.some(d => {
    if(fse.statSync(d).isDirectory()) {
      fse.copySync(d, distSubProject)
      return true;
    }
    return false;
  })
  // diff

  console.log(chalk.green('[3/3: DEPLOY]'));
  // todo
})()