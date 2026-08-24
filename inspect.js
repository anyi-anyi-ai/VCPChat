const WebSocket = require('ws');
const http = require('http');

http.get('http://localhost:9222/json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const pages = JSON.parse(data);
        const page = pages.find(p => p.url.includes('main.html') || p.type === 'page');
        if (!page) {
            console.log('No main.html found. Pages:', pages.map(p => p.url).join(', '));
            return;
        }
        console.log('Found page:', page.title);
        const ws = new WebSocket(page.webSocketDebuggerUrl);
        ws.on('open', () => {
            ws.send(JSON.stringify({id: 1, method: 'Runtime.enable'}));
            console.log('Listening for 3 seconds...');
            
            // Reload page to catch startup errors
            ws.send(JSON.stringify({id: 2, method: 'Page.reload'}));
            
            setTimeout(() => {
                ws.close();
            }, 3000);
        });
        ws.on('message', (msg) => {
            const m = JSON.parse(msg);
            if (m.method === 'Runtime.consoleAPICalled') {
                const args = m.params.args;
                let text = args.map(a => a.value !== undefined ? a.value : (a.description || '')).join(' ');
                console.log('[CONSOLE]', m.params.type.toUpperCase() + ':', text);
            } else if (m.method === 'Runtime.exceptionThrown') {
                console.log('[EXCEPTION]', m.params.exceptionDetails.exception ? m.params.exceptionDetails.exception.description : m.params.exceptionDetails.text);
            }
        });
    });
}).on('error', err => console.error(err.message));