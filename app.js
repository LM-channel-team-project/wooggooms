let express = require('express')
let app = express()
let bodyParser = require('body-parser')

app.listen(3000, function() {
    console.log('start express server on port 3000...');
});

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

// url routing
app.get('/', function(req,res) {
    res.sendFile(__dirname + '/public/main-non-member.html')
})

app.post('/email_post', function(req,res) {
    console.log(req.body.email)
    res.send('DB connection')
})