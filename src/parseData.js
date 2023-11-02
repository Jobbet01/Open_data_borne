const fs = require('fs');
const fsPromises = require('fs').promises
const csv = require('csv-parser');

// Specify the input CSV file path
const csvFilePath = 'data.csv';
const outputData = [];
function parseDataLocalisation() {
  fs.readFile(csvFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the CSV file:', err);
      return;
    }

    const jsonData = JSON.parse(data);
    const features = jsonData.features;

    for (const feature of features) {
      if (feature.geometry && feature.geometry.coordinates) {
        const coordinates = feature.geometry.coordinates;
        const longitude = coordinates[0];
        const latitude = coordinates[1];

        outputData.push({ longitude, latitude });
      }
    }
    fs.writeFileSync('output.json', JSON.stringify(outputData, null, 2));
    console.log('Data extracted and saved to output.json');
  });
  return outputData;
}
async function parseData(id) {
  let data;
  try {
    const fileData = await fsPromises.readFile(csvFilePath, 'utf8');
    const jsonData = JSON.parse(fileData);
    const features = jsonData.features;
    
    data = features[id];
  } catch (err) {
    console.error('Error reading the CSV file:', err);
  }
  return data;
}
module.exports = {
  parseDataLocalisation,
  parseData
};