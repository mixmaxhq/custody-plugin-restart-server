const {join: joinPath} = require('path');
const {promisify} = require('promise-callbacks');
const fileExists = promisify(require('fs').access);

async function canRestartServer(process) {
  const cwd = await process.getWorkingDirectory();
  const appPath = joinPath(cwd, 'app.js');
  try {
    await fileExists(appPath);
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = canRestartServer;
