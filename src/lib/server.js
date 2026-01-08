// server.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { getChatSocketServer } = require('./chat-socket');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    
    // Handle Socket.IO requests
    if (parsedUrl.pathname.startsWith('/api/chat-socket')) {
      // Let Socket.IO handle these requests
      return;
    }
    
    handle(req, res, parsedUrl);
  });

  // Initialize Chat Socket.IO server
  getChatSocketServer(server);

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Custom server ready on http://localhost:${PORT}`);
    console.log('> Chat socket server is running on /api/chat-socket');
  });
});