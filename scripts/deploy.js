const fse = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const inquirer = require('inquirer');
const chalk = require('chalk');

const { getAllAppsName, generateTime } = require('./utils');

; (async () => {
  const appsName = getAllAppsName()
  if (appsName.length === 0) {
    console.log(chalk.yellow('no project can be build. (please add "name", "version" in subProject \'s package.json)'));
    console.log(chalk.yellow('autofix please in root exec "yarn fix-package-name"'));
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
    if(fse.existsSync(d)) {
      fse.copySync(d, distSubProject, { overwrite: true })
      return true;
    }
    return false;
  })
  // diff
  execSync('git add .', { stdio: 'pipe' })
  const diffStr = execSync('git diff master --name-only -- ./dist', { stdio: 'pipe', encoding: 'utf-8' })
  const diffFiles = diffStr.split('\n').filter(f => Boolean(f))
  console.log('current change', diffFiles);

  const verify = diffFiles.every(f => f.substring(5).split('/')[0] === subProjectName);
  if (!verify) {
    console.log(chalk.red('deploy be block, check "./dist" some other files change'));
    diffFiles.forEach(f => {
      if (f.substring(5).split('/')[0] !== subProjectName) {
        console.log(f);
      }
    });
    process.exit(0)
  }

  const { continueDeploy } = await inquirer.prompt({
    type: 'confirm',
    name: 'continueDeploy',
    message: `verify success current only change ./dist/${subProjectName}`
  })
  if (!continueDeploy) {
    execSync('git reset HEAD', { stdio: 'pipe'})
    return
  }
  
  console.log(chalk.green('[3/3: DEPLOY]'));
  execSync(`git commit -m "feat: deploy ${subProjectName}"`, { stdio: 'pipe' })
  const date = new Date();
  const tagName = `deploy-${generateTime()}`
  execSync(`git tag ${tagName}`, { stdio: 'pipe' })
  execSync(`git push origin ${tagName}`, { stdio: 'pipe' })
})()