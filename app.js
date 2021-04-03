const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const low = require('lowdb');
const swaggerUI = require ("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const measurementsRouter = require("./routes/measurements");

const port = process.env.port || 3000;

const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);



db.defaults( { measurements: [] }).write();


const options = {
    definition: {
        openapi: "3.0.0",
        info:{
            title:"Library API",
            version: "1.0.0",
            description: "A simple Express Library API"
        },
        servers:[
            {
                url: "http://localhost:3000"
            }, 
            {
                url:"http://node-env.eba-cxpmis6b.us-east-2.elasticbeanstalk.com/"
            }
        ],
    },
    apis: ["./routes/*.js"]
}

const specs = swaggerJsDoc(options);

const app = express();

app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))
app.use(express.static(__dirname + '/'));


app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))

app.db = db;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/measurements", measurementsRouter);

app.get('', (req, res) => {
    res.sendFile(__dirname + '/view/index.html');
});

app.get('/table', (req, res) => {
    res.sendFile(__dirname + '/measurement.html');
});

app.get('/test', (req, res) => {
    res.sendFile(__dirname + '/myown.html');
});


app.listen(port, () => {
    console.log("Wazzzzappp");
});

