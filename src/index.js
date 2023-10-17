// basic express server

const express = require('express');
const app = express();
const port = 3000;
const getDataGouv = require('./getDataGouv.js');
const parseData = require('./parseData.js');
let data = [];

async function initDataGouv() {
  await getDataGouv();
  data = parseData();
}

initDataGouv();
app.use(express.static('static'));

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/data', (req, res) => {
    res.send(data);
    });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
