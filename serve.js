const http = require('http');
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const PORT = process.env.PORT || 8765;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.glb':  'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.wasm': 'application/wasm',
};

http.createServer((req, res) => {
  try {
    let url = decodeURIComponent((req.url || '/').split('?')[0]);
    if (url === '/' || url === '') url = '/index.html';
    const full = path.normalize(path.join(DIR, url));
    if (!full.startsWith(DIR)) { res.writeHead(403); return res.end('forbidden'); }
    fs.stat(full, (err, st) => {
      if (err || !st.isFile()) { res.writeHead(404); return res.end('not found'); }
      const ext = path.extname(full).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Content-Length': st.size,
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
      });
      fs.createReadStream(full).pipe(res);
    });
  } catch (e) {
    res.writeHead(500); res.end(String(e));
  }
}).listen(PORT, '127.0.0.1', () => {
  console.log(`serving ${DIR} at http://127.0.0.1:${PORT}`);
});
