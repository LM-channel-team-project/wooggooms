const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;

app.use(express.static(__dirname+'/styles'));

app.get('/',(req,res,next)=> {
    var options = {
        root : path.join(__dirname,'views')
    };

    var fileName = 'Main'
    res.sendFile(`${fileName}.html`, options, function(err){
        if(err) {
            next(err);
        } else {
            console.log('Main page :',fileName);
        }
    });
});


app.get('/:name', (req, res, next) => {
    var options = {
        root : path.join(__dirname,'views')
    };
    var fileName = req.params.name;
    res.sendFile(`${fileName}.html`, options, function(err) {
        if(err) {
            next(err);
        } else {
            console.log('HTML : ',fileName);
        }
    });
});


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});