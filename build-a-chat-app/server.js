import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';

const PORT = 3001;
const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    if (fs.existsSync('./index.html')) {
      fs.createReadStream('./index.html').pipe(res);
    } else {
      res.end('<!DOCTYPE html><html><body><h1>Chat Server Running</h1></body></html>');
    }
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});
const wss = new WebSocketServer({ server });
const clients = new Map();
function broadcast(payload) {
  const message = JSON.stringify(payload);
  for (const [client] of clients) {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  }
}
wss.on('connection', (ws, req) => {
  const urlParams = new URLSearchParams(req.url.replace(/^.*\?/, ''));
  const username = urlParams.get('username') || `User_${Math.floor(Math.random() * 1000)}`;
  clients.set(ws, username);
  broadcast({
    type: 'system',
    text: `${username} joined the chat.`
  });
  ws.on('message', (data) => {
    try {
      const parsed = JSON.parse(data.toString());
      const text = parsed.text || data.toString();
      broadcast({
        type: 'chat',
        username: clients.get(ws),
        text: text
      });
    } catch {
      broadcast({
        type: 'chat',
        username: clients.get(ws),
        text: data.toString()
      });
    }
  });
  ws.on('close', () => {
    const disconnectedUsername = clients.get(ws);
    clients.delete(ws);
    broadcast({
      type: 'system',
      text: `${disconnectedUsername} left the chat.`
    });
  });
});
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});