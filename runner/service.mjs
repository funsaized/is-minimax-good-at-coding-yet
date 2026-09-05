import { command, ROOT, config } from './lib.mjs'

const action = process.argv[2]
if (action === 'start') {
  console.log(await command('systemd-run', [
    '--user', `--unit=${config.serviceName}`, '--collect',
    '--property=Restart=on-failure', '--property=RestartSec=30', '--property=KillMode=control-group',
    `--working-directory=${ROOT}`, `--setenv=PATH=${process.env.PATH}`, '--setenv=CI=true',
    process.execPath, `${ROOT}/runner/index.mjs`, 'loop',
  ]))
  console.log(`Started. Logs: journalctl --user -u ${config.serviceName} -f`)
} else if (action === 'stop') {
  console.log(await command('systemctl', ['--user', 'stop', config.serviceName]))
} else if (action === 'status') {
  console.log(await command('systemctl', ['--user', 'status', config.serviceName, '--no-pager']))
} else { console.error('Usage: node runner/service.mjs start|stop|status'); process.exitCode = 1 }
