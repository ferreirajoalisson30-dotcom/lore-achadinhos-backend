const http = require('http');

const options = { method: 'GET', host: 'localhost', port: process.env.PORT || 3000, path: '/api/health' };
const req = http.request(options, res => {
  let data = '';
  res.on('data', chunk=>data += chunk.toString());
  res.on('end', ()=> {
    console.log('Health response', res.statusCode, data);
    process.exit(res.statusCode === 200 ? 0 : 1);
  });
});
req.on('error', err => { console.error('Test error', err); process.exit(2); });
req.end();
