const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send("Welcome to the home page baby");
});

app.get('/measurements', (req,res) => {
    res.send("This is where we put the measurements");
});

const port = process.env.port || 3000;

app.listen(port, () => {
    console.log("Wazzzzappp");
});

