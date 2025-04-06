const http = require('http');
const fs = require('fs');
const path = require('path');

// Main application server (Port 5000)
http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') filePath = './index.html';
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found');
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
}).listen(5000, () => {
    console.log('Main application running on http://localhost:5000');
});

// Canteen Management System (Port 5175)
http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Canteen Management System');
}).listen(5175, () => {
    console.log('Canteen System running on http://localhost:5175');
});

// Lost and Found System (Port 5176)
http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Lost and Found System');
}).listen(5176, () => {
    console.log('Lost & Found System running on http://localhost:5176');
});

// Scholarship System (Port 5177)
http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Scholarship Matching System');
}).listen(5177, () => {
    console.log('Scholarship System running on http://localhost:5177');
});