const http = require('node:http');
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';
const phpHost = process.env.PHP_HOST || '127.0.0.1';
const phpPort = Number(process.env.PHP_PORT || 8000);
const phpVirtualHost = process.env.PHP_VHOST || phpHost;
http.createServer(function(req, res) {
    const headers = Object.assign({}, req.headers);
    headers.host = phpVirtualHost + ':' + phpPort;
    delete headers['x-forwarded-host'];
    delete headers['x-forwarded-proto'];
    const upstream = http.request({ hostname: phpHost, port: phpPort, path: req.url, method: req.method, headers }, function(reply) {
        res.writeHead(reply.statusCode, reply.headers);
        reply.pipe(res);
    });
    upstream.setTimeout(30000, function() {
        upstream.destroy(new Error('PHP timeout'));
    });
    upstream.on('error', function() {
        if (res.headersSent) { res.destroy(); return; }
        res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'PHP սերվերը հասանելի չէ։ Միացրու PHP/Apache-ը։' }));
    });
    req.on('aborted', function() {
        upstream.destroy();
    });
    req.pipe(upstream);
}).listen(port, host, function() {
    console.log('Բացիր http://' + host + ':' + port + '/intership/');
});