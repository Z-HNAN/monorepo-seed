const path = require('path')
const fse = require('fs-extra');

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
  })
}

module.exports = {
  getAllAppsDir,
  getAllAppsName,
}