const https = require('follow-redirects').https;
const fs = require('fs');

function getDataGouv() {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream("data.csv");
  
      const request = https.get("https://www.data.gouv.fr/fr/datasets/r/7eee8f09-5d1b-4f48-a304-5e99e8da1e26", function(response) {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          // If the response is a redirect, follow it
          https.get(response.headers.location, function(response) {
            response.pipe(file);
  
            // after download completed close filestream
            file.on("finish", () => {
              file.close();
              console.log("Download Completed");
              resolve();
            });
          });
        } else {
          response.pipe(file);
  
          // after download completed close filestream
          file.on("finish", () => {
            file.close();
            console.log("Download Completed");
            resolve();
          });
        }
      });
    });
  }

module.exports = getDataGouv;