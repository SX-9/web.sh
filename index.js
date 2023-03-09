#! /bin/node

import express from 'express';
import cors from 'cors';
import { execaSync } from 'execa';
import c from 'chalk';
import os from 'os';

const pass = process.env.PASSWORD || 'HelloWorld';
const app = express();

app.use(cors({ origin: ['https://web-sh.sx9.is-a.dev', 'http://web-sh.sx9.is-a.dev'] }));
app.use(express.json());

app.use((req, res, next) => {
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

app.get('/', (req, res) => res.json({
    message: 'Welcome To The Web.Sh API!',
    note: 'The Password By Default Is "HelloWorld" But You Can Also Set It From The Environment Variable "PASSWORD"',
    requestFormat: {
        method: 'POST',
        route: '/run?pass=PASSWORD',
        body: {
            exec: 'COMMAND / SCRIPT',
            args: ['ARG1', 'ARG2', 'ARG3']
        }
    }
}));

app.post('/run', (req, res) => {
    if (!req.body.exec) return res.status(400).json({ message: 'Execution Failed' });
    if (req.query.pass !== pass) {
        console.log(c.red(c.bold('Wrong Password: ') + req.query.pass));
        res.status(401).json({ message: 'Access Denied' });
        return;
    }
    
    console.log(c.blue(c.bold('Running: ') + req.body.exec + ' ' + req.body.args.join(' ')));
    let out;
    
    try {
        out = execaSync(req.body.exec, req.body.args);
        console.log(out.stdout || out.stderr);
        res.json({
            message: 'Success',
            status: out.exitCode,
            outputs: out.stdout || out.stderr,
            host: os.userInfo().username + '@' + os.hostname()
        });
        console.log(c.green(c.bold('Success!')));
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
        c.yellow(c.bold('\n* New Dashboard') + ' @ ' + c.underline('https://web-sh.sx9.is-a.dev')), '\n'
    );
});
