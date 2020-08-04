#!/usr/bin/env node
const path = require('path');
const cp = require('child_process');

const clientPackage = require(path.resolve(__dirname, 'package.json'));

function getScript() {
    const commandIndex = process.argv.findIndex(arg => arg.endsWith('molax-cli')) + 1;
    const args = process.argv.slice(commandIndex);
    if (!args[0]) {
        throw new Error('Please specify the script');
    }
    const script = args[0];
    const scripts = clientPackage['molax-scripts'];
    if (!(script in scripts)) {
        throw new Error('Script does not exist: ' + script);
    }
    return [scripts[script], ...args.slice(1, args.length)].join(' ');
}

function run(script) {
    return new Promise((resolve, reject) => {
        const env = Object.assign({}, process.env);
        const scriptProcess = cp.exec(script, {
            env,
            cwd: process.cwd()
        });
        scriptProcess.stdout.pipe(process.stdout);
        scriptProcess.stderr.pipe(process.stderr);
        scriptProcess.on('error', reject);
        scriptProcess.on('close', resolve);
    });
}

(async () => {
    process.exitCode = 0;
    let script = undefined;
    try {
      script = getScript();
      exitCode = await run(script);
    } catch (err) {
        if (script) {
            console.error(`Error occurred in molax-cli when executing: '${script}'`, err);
        } else {
            console.error('Error occurred in molax-cli', err);
        }
        console.log(`${err.name}: ${err.message}`);
        exitCode = 1;
    }
    process.exitCode = exitCode;
})();
