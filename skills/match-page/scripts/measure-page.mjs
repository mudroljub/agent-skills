// Usage: node measure-page.mjs <url> <out.png> [width] [height] [waitMs] [expression]
//
// Opens <url> in headless Chrome with a width x height viewport (default 1920 x 1080),
// waits waitMs of real time (default 6000), prints the JSON value of the optional
// JavaScript expression, and saves a PNG screenshot of the viewport to <out.png>.
// Example expression: JSON-serialisable bounding boxes, such as
//   "[...document.querySelectorAll('h1, button')].map((e) => e.getBoundingClientRect().toJSON())"
// Node 22+, no packages. Environment: CHROME_PATH (browser binary).
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const [url, out, width = '1920', height = '1080', waitMs = '6000', expression] = process.argv.slice(2);
if (!url || !out) {
    console.error('Usage: node measure-page.mjs <url> <out.png> [width] [height] [waitMs] [expression]');
    process.exit(2);
}

const defaultChrome = {
    win32: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
}[process.platform] ?? 'google-chrome';
const chromePath = process.env.CHROME_PATH || defaultChrome;
const commandTimeoutMs = 30_000;
const profile = mkdtempSync(join(tmpdir(), 'measure-page-'));

const chrome = spawn(
    chromePath,
    // Port 0 lets Chrome pick a free port, so another browser on a fixed port is never reused.
    ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'],
    { stdio: 'ignore' },
);
let launchError;
chrome.on('error', (error) => (launchError = error));

let socket;
try {
    socket = await connect(await findPageTarget());
    const send = commandSender(socket);
    await send('Page.enable');
    // A headless window keeps its browser chrome, so --window-size alone yields a smaller viewport.
    await send('Emulation.setDeviceMetricsOverride', {
        width: Number(width),
        height: Number(height),
        deviceScaleFactor: 1,
        mobile: false,
    });
    const navigation = await send('Page.navigate', { url });
    if (navigation.errorText) throw new Error(`Navigation to ${url} failed: ${navigation.errorText}`);
    await sleep(Number(waitMs));
    if (expression) {
        const evaluation = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
        if (evaluation.exceptionDetails) {
            const { exception, text } = evaluation.exceptionDetails;
            throw new Error(`Expression failed: ${exception?.description ?? text}`);
        }
        console.log(JSON.stringify(evaluation.result.value));
    }
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(out, Buffer.from(data, 'base64'));
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
} finally {
    socket?.close();
    if (chrome.exitCode === null && chrome.signalCode === null && !launchError) {
        chrome.kill();
        await once(chrome, 'exit');
    }
    rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}

async function findPageTarget() {
    for (let attempt = 0; attempt < 50 && !launchError; attempt++) {
        await sleep(200);
        try {
            const port = readFileSync(join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0];
            const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
            const page = targets.find((target) => target.type === 'page');
            if (page) return page;
        } catch {
            // Chrome has not written its port or is not listening yet.
        }
    }
    const reason = launchError ? `could not start ${chromePath}: ${launchError.message}` : 'gave no page target after 10 s';
    throw new Error(`Chrome ${reason}. Set CHROME_PATH if the default does not fit.`);
}

async function connect(target) {
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
        ws.addEventListener('open', resolve);
        ws.addEventListener('error', () => reject(new Error('Cannot connect to the Chrome DevTools socket.')));
    });
    return ws;
}

function commandSender(ws) {
    let lastId = 0;
    const pending = new Map();
    ws.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        const callbacks = pending.get(message.id);
        if (!callbacks) return;
        pending.delete(message.id);
        if (message.error) callbacks.reject(new Error(`${callbacks.method}: ${message.error.message}`));
        else callbacks.resolve(message.result);
    });
    return (method, params = {}) => {
        const id = ++lastId;
        const reply = new Promise((resolve, reject) => pending.set(id, { method, resolve, reject }));
        ws.send(JSON.stringify({ id, method, params }));
        const timeout = sleep(commandTimeoutMs, undefined, { ref: false }).then(() => {
            throw new Error(`${method} timed out after ${commandTimeoutMs / 1000} s.`);
        });
        return Promise.race([reply, timeout]);
    };
}
