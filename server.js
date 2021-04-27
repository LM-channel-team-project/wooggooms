const http = require('http');
const fs = require('fs');
const url = require('url');


const app = http.createServer((req, res)=>{
    let _url = req.url;

    if(_url === '/') {
        fs.readFile('./views/main.html', (err, data)=> {
            res.end(data);
        });
    } else if(_url === '/login') {
        fs.readFile('./views/login.html', (err, data)=> {
            res.end(data);
        });    
    } else if(_url === '/mypage') {
        fs.readFile('./views/mypage.html', (err, data)=> {
            res.end(data);
        });
    } else if(_url === '/create') {
        fs.readFile('./views/create.html', (err, data)=> {
            res.end(data);
        });
    } else if(_url === '/login/signup') {
        fs.readFile('./views/signup.html', (err, data)=> {
            res.end(data);
        });
    }
})



app.listen(3000, function(){
    console.log('listening on 3000');
})