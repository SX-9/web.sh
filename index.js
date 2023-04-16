#! /bin/node

import { execaSync } from 'execa';
import express from 'express';
import rl from 'readline';
import cors from 'cors';
import c from 'chalk';
import os from 'os';
import fs from 'fs';

const pass = process.env.PASSWORD || 'HelloWorld';
const app = express();

if (process.argv[2] === 'setup') {
    let dir = '/home/' + os.userInfo().username + '/.config/systemd/user';
    if (process.platform !== 'linux') process.exit(1);
    if (process?.getuid() === 0) process.exit(1);
    if (fs.existsSync('/usr/bin/web-sh')) console.log(c.yellow('Warning: Please Install Web.Sh Globally After Setup'));
    console.log(c.green('Setting Up User Systemd Service...'));
    if (!fs.existsSync(dir)) execaSync('mkdir', [dir]);
    fs.writeFileSync(dir + '/websh.service', `\
[Unit]
Description=Autostart Web.Sh

[Service]
Environment="PASSWORD=${pass}"
ExecStart=/usr/bin/web-sh

[Install]
WantedBy=default.target
`);
    console.log(c.cyan('Setup Complete! Now Run: systemctl enable websh.service --user --now'));
    process.exit(0);
}

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use((req, _res, next) => {
    console.log(c.bgGrey(new Date()));
    console.log(
        c.grey(req.ip), 
        c.yellow(req.method), 
        c.underline(req.hostname), 
        c.blue(c.underline(req.url)),
        '\n'
    );
    next();
});

app.get('/', (_req, res) => res.json({
    message: 'Welcome To The Web.Sh API!',
    documentation: 'https://github.com/SX-9/web.sh#docs',
}));

app.post('/run', (req, res) => {
    if (!req.body[0]) return res.status(400).json({ message: 'Execution Failed' });
    if (req.query.pass !== pass) {
        console.log(c.red(c.bold('Wrong Password: ') + req.query.pass));
        res.status(401).json({ message: 'Access Denied' });
        return;
    }
    
    console.log(c.blue(c.bold('Running: ') + req.body[0] + ' ' + req.body.slice(1).join(' ')));
    let out;
    
    try {
        out = execaSync(req.body[0], req.body.slice(1));
        console.log(out.stdout || out.stderr);
        res.json({
            message: 'Success',
            status: out.exitCode,
            output: out.stdout || out.stderr,
            host: os.userInfo().username + '@' + os.hostname(),
            cmd: out.command,
        });
        console.log(c.green(c.bold('Success!\n')));
    } catch (e) {
        console.log(c.red(c.bold('Error: ') + e.message));
        res.json({ message: 'Failed', error: e.message });
    }
});

app.listen(6942, () => {
    console.clear();
    console.log(
        c.green(c.bold('\nStarted')), c.grey(' @ '),
        c.blue('Port ' + c.underline('6942')), 
        c.yellow(c.bold('\n* Dashboard') + ' @ ' + c.underline('https://web-sh.sx9.is-a.dev')), '\n'
    );
});
