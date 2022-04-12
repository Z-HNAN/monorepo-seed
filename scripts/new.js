const fse = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const inquirer = require('inquirer');
const chalk = require('chalk');

const { getAllAppsDir } = require('./utils')

  ; const { type } = require('os');
(async () => {
  const allAppsDir = getAllAppsDir();
  const allAppsFolderName = allAppsDir.map(d => path.basename(d))

  const { name: subProjectName } = await inquirer.prompt({
    type: 'input',
    name: 'name',
    message: 'input new subProject name, also is folder name',
    transformer: (val, answers, { isFinal }) => isFinal ? chalk.cyan(`packages/${val}`) : `packages/${val}`,
    validate: val => {
      // folder repeat
      if (allAppsFolderName.indexOf(val) !== -1) {
        return `current name ${val} is exist!`
      }
      // name format
      const pattern = /^[A-Za-z0-9_\@]+$/
      if (pattern.test(val) === false) {
        return 'name can only contain [A-Za-z0-9_\@]'
      }
      return true
    },
  })

  const { generatorType } = await inquirer.prompt({
    type: 'list',
    name: 'generatorType',
    message: 'select generator type',
    choices: [{ name: 'copy local template', value: 'local' }, { name: 'use offical create cli(like create-umi)', value: 'offical' }],
  })


  if (generatorType === 'local') { // generate by local
    // 1. select template
    const templateRoot = path.resolve(__dirname, '../template');
    const templateNames = fse
      .readdirSync(templateRoot)
      .filter(fileOrDir => fse.statSync(path.join(templateRoot, fileOrDir)).isDirectory() && (!/^\./.test(fileOrDir))) // exclude file and hidden file/dir

    if (templateNames.length === 0) {
      console.log(chalk.red('at least exists one template! (like <root>/template/base/package.json)'));
      process.exit(0)
    }

    const { templateName } = await inquirer.prompt({
      type: 'list',
      name: 'templateName',
      message: 'choice template',
      choices: templateNames
    })

    // 2. copy template
    const subProjectRoot = path.resolve(__dirname, `../packages/${subProjectName}`);
    fse.ensureDirSync(subProjectRoot)
    fse.copySync(path.resolve(templateRoot, templateName), subProjectRoot)

    // 3. modify package.json name
    const pkgDir = path.resolve(subProjectRoot, './package.json')
    if (!fse.existsSync(pkgDir)) {
      execSync('yarn init -y', { cwd: subProjectRoot, stdio: 'pipe' })
    }
    const pkg = fse.readJSONSync(pkgDir, { encoding: 'utf-8' })
    pkg.name = subProjectName
    pkg.version = pkg.version ? pkg.version : '1.0.0'
    pkg.private = true
    fse.writeJSONSync(pkgDir, pkg, { encoding: 'utf-8', spaces: 2 })
  } else if (generatorType === 'offical') { // generate by offical cli
    const subProjectRoot = path.resolve(__dirname, `../packages/${subProjectName}`);
    fse.ensureDirSync(subProjectRoot)

    // in create-react-app will confilce package.json
    execSync('yarn init -y', { cwd: subProjectRoot, stdio: 'pipe' })
    const pkgDir = path.resolve(subProjectRoot, './package.json')
    const pkg = fse.readJSONSync(pkgDir, { encoding: 'utf-8' })
    pkg.name = subProjectName
    pkg.version = pkg.version ? pkg.version : '1.0.0'
    pkg.private = true
    fse.writeJSONSync(pkgDir, pkg, { encoding: 'utf-8', spaces: 2 })

    console.log('please use create-cli to manually create ensure exist "name", "version" in package.json');
    // console.log(chalk.cyan(`yarn workspace ${subProjectName} run create-react-app ./ d--template typescript`));
    console.log(chalk.cyan(`yarn workspace ${subProjectName} run create-umi`));
  }

  console.log(chalk.green('SUCCESS'));
})()