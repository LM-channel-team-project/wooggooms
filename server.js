const express = require('express');
const app = express();
const path = require('path');

const PORT = 3000;

// Routes
app.get('/', (req, res, next) => {
    res.sendFile('main.html', { root: path.join(__dirname, 'views')}, (err) => {
        if(err) {
            next(err);
        } else {
            console.log("Sent: main.html");
        }
    });
})

app.get('/:pageName', (req, res, next) => {
    const fileName = req.params.pageName;
    res.sendFile(`${fileName}.html`, { root: path.join(__dirname, 'views')}, (err) => {
        if(err) {
            next(err);
        } else {
            console.log(`Sent: ${fileName}.html`);
        }
    });
});


// Handle 404 error
app.use((req, res, next) => {
    res.status(404).send('Not Found');
})
// Handle server error
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
})

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});