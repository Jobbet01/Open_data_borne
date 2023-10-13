// basic express server

const express = require('express');
const app = express();
const port = 3000;
const getDataGouv = require('./getDataGouv.js');

getDataGouv();
app.use(express.static('static'));

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
