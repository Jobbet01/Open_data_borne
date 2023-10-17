const fs = require('fs');
const csv = require('csv-parser');

// Specify the input CSV file path
const csvFilePath = 'data.csv';
const outputData = [];
function parseData() {

    

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
      
        // Print or manipulate the data as needed
        // console.log(outputData);
      
        // If you want to save the data to a JSON file
        fs.writeFileSync('output.json', JSON.stringify(outputData, null, 2));
        console.log('Data extracted and saved to output.json');
      });
      return outputData;
    
}

module.exports = parseData;