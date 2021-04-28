const http = require('http');
const fs = require('fs');
const url = require('url');


const app = http.createServer((req, res) => {
    let _url = req.url;

    if(_url === '/') {
        fs.readFile('./views/main.html', (err, html) => {
            res.writeHead(200, {
                "Content-Type": "text/html"
            });
            res.end(html);
        });
    } else if(_url === '/login') {
        fs.readFile('./views/login.html', (err, html) => {
            res.writeHead(200, {
                "Content-Type": "text/html"
            });
            res.end(html);
        });    
    } else if(_url === '/mypage') {
        fs.readFile('./views/mypage.html', (err, html) => {
            res.writeHead(200, {
                "Content-Type": "text/html"
            });
            res.end(html);
        });
    } else if(_url === '/create') {
        fs.readFile('./views/create.html', (err, html) => {
            res.writeHead(200, {
                "Content-Type": "text/html"
            });
            res.end(html);
        });
    } else if(_url === '/signup') {
        fs.readFile('./views/signup.html', (err, html) => {
            res.writeHead(200, {
                "Content-Type": "text/html"
            });
            res.end(html);
        });
    } else if(_url === '/create_process') {
        // process create-study
        // redirect to mypage after processing create-study
        res.writeHead(302, {Location: '/mypage'});
        res.end();
    } else if(_url === '/signup_process') {
        // process sign-up
        // redirect to mainpage after processing sign up
        res.writeHead(302, {Location: '/'});
        res.end();
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
})


app.listen(3000, function() {
    console.log('listening on 3000');
})