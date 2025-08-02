const http = require('http');
const assert = require('assert');
const app = require('./index');

const server = app.listen(0, () => {
  const { port } = server.address();
  const data = JSON.stringify({ name: 'John', password: 'secret' });

  const opts = {
    hostname: 'localhost',
    port,
    path: '/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  const req = http.request(opts, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      try {
        assert.strictEqual(res.statusCode, 200);
        const json = JSON.parse(body);
        assert.strictEqual(json.message, 'Login successful');
        console.log('Login test passed');
        server.close();
      } catch (err) {
        console.error('Test failed');
        console.error(err);
        server.close(() => process.exit(1));
      }
    });
  });

  req.on('error', (err) => {
    console.error(err);
    server.close(() => process.exit(1));
  });

  req.write(data);
  req.end();
});
