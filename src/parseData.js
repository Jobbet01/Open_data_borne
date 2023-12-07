const fs = require('fs');
const fsPromises = require('fs').promises
const csv = require('csv-parser');
const { log } = require('console');

// Specify the input CSV file path
const csvFilePath = 'data.csv';
const outputData = [];
let mainData = [];

function parseDataLocalisation() {
  fs.readFile(csvFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the CSV file:', err);
      return;
    }

    const jsonData = JSON.parse(data);
    const features = jsonData.features;

    for (const feature of features) {
      if (feature.properties && feature.properties.coordonneesXY) {
        const coordinates = feature.properties.coordonneesXY.split(',');
        const longitude = coordinates[0].substring(1);
        let latitude;
        if (coordinates[1].includes(' ')) {
          latitude = coordinates[1].substring(1, coordinates[1].length - 1);
        } else {
          latitude = coordinates[1].substring(0, coordinates[1].length - 1);
        }
        if (!outputData.some((item) => item.longitude === parseFloat(longitude) && item.latitude === parseFloat(latitude))) {
          outputData.push({ longitude: parseFloat(longitude), latitude: parseFloat(latitude) });
          mainData.push(feature);
        }
      }
    }
  });
  return outputData;
}
async function parseData(id) {
  let data;
  try {
    data = mainData[id];
  } catch (err) {
    console.error('Error reading the CSV file:', err);
  }
  return data;
}
module.exports = {
  parseDataLocalisation,
  parseData
};