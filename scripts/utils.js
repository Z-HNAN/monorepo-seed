const path = require('path')
const fse = require('fs-extra');
const childProcess = require('child_process');

function isAppRoot(dir) {
  return fse.existsSync(path.resolve(dir, './package.json'), fse.constants.R_OK)
}


function getAllAppsDir() {
  const packagesRootPath = path.resolve(__dirname, '../packages')
  const appRoots = []

  const travelDirs = [packagesRootPath]
  while (travelDirs.length !== 0) {
    const travelDir = travelDirs.shift()

    if (isAppRoot(travelDir)) {
      appRoots.push(travelDir)
      continue
    }

    const nextDirs = fse
      .readdirSync(travelDir)
      .filter(d => /^(\.|node_modules)/.test(d) === false)
      .map(d => path.resolve(travelDir, d))
      .filter(d => fse.statSync(d).isDirectory())
    travelDirs.push(...nextDirs)
  }

  return appRoots;
}

/**
 * get package.name *folder enqual package.name*
 * @returns 
 */
function getAllAppsName() {
  const appsDir = getAllAppsDir();
  return appsDir.map(appDir => {
    const pkg = fse.readJSONSync(path.resolve(appDir, './package.json'), { encoding: 'utf-8' })
    return pkg.name
  }).filter(d => Boolean(d))
}

function pad2(n) { return n < 10 ? '0' + n : n }

function generateTime() {
  var date = new Date();
  return date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds());
}

function getCurrentGitBranch() {
  return childProcess.execSync('git rev-parse --abbrev-ref HEAD').toString().replace(/\s+/, '');
}

module.exports = {
  getAllAppsDir,
  getAllAppsName,
  generateTime,
  getCurrentGitBranch
}