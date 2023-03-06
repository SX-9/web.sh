#! /bin/node

import express from 'express';
import cors from 'cors';
import execa from 'execa';
import c from 'chalk';

const pass = process.env.PASSWORD || 'HelloWorld';
const app = express();

app.use(cors({ origin: '*' }));
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

app.post('/run', async (req, res) => {
    if (!!req.body.exec) return res.status(400).json({ message: 'Ececution Failed' });
    if (req.query.pass !== pass) {
        console.log(c.red(c.bold('Wrong Password: ') + req.query.pass));
        res.status(401).json({ message: 'Access Denied' });
        return;
    }
    
    console.log(c.blue(c.bold('Running: ') + req.body.exec));
    let out;
    
    try {
        let stop = false;
        await execa(req.body.exec, req.body.args).stdout?.on('data', out => {
            if (stop) return;
            stop = true;
            console.log(out.toString());
            res.json({
                message: 'Success',
                outputs: out.toString(),
                host: process.env.USER + ' @ ' + process.hostname
            });
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
        c.green(c.bold('Started')), c.grey(' @ '),
        c.blue('Port ' + c.underline('6942')), '\n'
    );
});

process.on('exit', () => fs.writeFileSync('./logs.json', JSON.stringify(logs, null, 2)));
