const http = require('http');
const fs = require('fs');

const PORT = 3000;


const app = http.createServer((req, res) => {
    let _url = req.url;

    switch (_url) {
        case '/':
            fs.readFile('./views/main.html', (err, data) => {
                res.writeHead(200, {
                    "Content-Type": "text/html"
                });
                res.end(data);
            });
            break;
        case '/sign-in':
            fs.readFile('./views/sign-in.html', (err, data) => {
                res.writeHead(200, {
                    "Content-Type": "text/html"
                });
                res.end(data);
            });
            break;
        case '/mypage':
            fs.readFile('./views/mypage.html', (err, data) => {
                res.writeHead(200, {
                    "Content-Type": "text/html"
                });
                res.end(data);
            });
            break;
        case '/create':
            fs.readFile('./views/create.html', (err, data) => {
                res.writeHead(200, {
                    "Content-Type": "text/html"
                });
                res.end(data);
            });
            break;
        case '/sign-up':
            fs.readFile('./views/sign-up.html', (err, data) => {
                res.writeHead(200, {
                    "Content-Type": "text/html"
                });
                res.end(data);
            });
            break;
        default:
            res.writeHead(404);
            res.end('Not Found');
    }
});

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
})