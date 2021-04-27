const http = require('http');
const fs = require('fs');
const url = require('url');


function getPage(_url, res) {
    fs.readFile(`./views${_url}.html`, (err, page)=> {
        res.end(page);
    });
}

const app = http.createServer((req, res)=>{
    let _url = req.url;
    let queryData = url.parse(_url, true).query;
    let pathname = url.parse(_url, true).pathname;
    let page;
    
    // if(_url === '/') {
    //     fs.readFile('./pages/index.html', (err, page)=> {
    //         res.end(page);
    //     });
    // }
    // if(_url === '/login') {
    //     fs.readFile('./pages/login.html', (err, page)=> {
    //         res.end(page);
    //     });    
    // }
    // if(_url === '/mypage') {
    //     fs.readFile('./pages/mypage.html', (err, page)=> {
    //         res.end(page);
    //     });
    // }
    // if(_url === '/create') {
    //     fs.readFile('./pages/create.html', (err, page)=> {
    //         res.end(page);
    //     });
    // }
    if (_url === '/') {
        //getPage('/index', res);
        res.render('index.html')
    } else {
        page = getPage(_url, res);
    }

    console.log(pathname);
})




app.listen(7777, function(){
    console.log('listening on 7777');
})

