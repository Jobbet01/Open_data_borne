const express = require('express');
const app = express();
const port = 3000;
const getDataGouv = require('./getDataGouv.js');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const { parseDataLocalisation, parseData } = require('./parseData.js');
let dataLocalisation = [];
let data;

cron.schedule('0 3 * * 2', async () => {
  await getDataGouv();
  dataLocalisation = parseDataLocalisation();
  console.log('data updated');
}
);

async function initDataGouv() {
  await getDataGouv();
  dataLocalisation = parseDataLocalisation();
}

initDataGouv();
app.use(express.static('static'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.redirect('/main.html');
}
);

app.get('/dataLocalisation', (req, res) => {
  res.send(dataLocalisation);
});

app.post('/data', async (req, res) => {
  data = await parseData(req.body.id);
  res.send(data);
});

app.listen(port);
