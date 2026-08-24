const WebSocket = require('ws');
const http = require('http');

http.get('http://localhost:9222/json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const pages = JSON.parse(data);
        const page = pages.find(p => p.type === 'page' && !p.url.includes('devtools'));
        if (!page) {
            console.log('No page found');
            return;
        }
        console.log('Found page URL:', page.url);
        const ws = new WebSocket(page.webSocketDebuggerUrl);
        ws.on('open', () => {
            ws.send(JSON.stringify({
                id: 1,
                method: 'Runtime.evaluate',
                params: { expression: 'document.body ? document.body.innerHTML.length : "no body"' }
            }));
            ws.send(JSON.stringify({
                id: 2,
                method: 'Runtime.evaluate',
                params: { expression: 'document.title' }
            }));
            ws.send(JSON.stringify({
                id: 3,
                method: 'Runtime.evaluate',
                params: { expression: 'window.onerror ? window.onerror.toString() : "no error handler"' }
            }));
        });
        ws.on('message', (msg) => {
            const m = JSON.parse(msg);
            if (m.id) console.log('Result', m.id, m.result);
            if (m.id === 3) {
                ws.close();
            }
        });
    });
});