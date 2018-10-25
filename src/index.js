const canRestartServer = require('./canRestartServer');
const {promisify} = require('promise-callbacks');
const lazyMemoize = require('lazy-memoize-one');

const exec = promisify(require('child_process').exec);

const DEFAULT_KEY = 't';

module.exports = function({ debug }, opts) {
  const canRestart = lazyMemoize(canRestartServer, (p1, p2) => p1.name === p2.name);

  return {
    commands(process, { setNeedsReload }) {
      const canRunCommand = canRestart(process, (err) => {
        if (err) {
          debug('Could not determine whether could restart the server:', err);
          return;
        }
        setNeedsReload();
      });

      // This will be falsy if we haven't yet determined whether we can restart the server, or we
      // did and the answer was "no".
      if (!canRunCommand) return [];

      return [
        [opts.key || DEFAULT_KEY, {
          verb: 'restart (just the server)',
          async toggle() {
            const cwd = await process.getWorkingDirectory();
            return exec('touch app.js', { cwd });
          }
        }]
      ];
    }
  };
};
