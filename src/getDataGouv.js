const https = require('https'); // or 'https' for https:// URLs
const fs = require('fs');

function getData()
{
    const file = fs.createWriteStream("data.csv");
    const request = https.get("https://static.data.gouv.fr/resources/fichier-consolide-des-bornes-de-recharge-pour-vehicules-electriques/20231013-075242/consolidation-etalab-schema-irve-statique-v-2.2.0-20231012.json", function(response) {
       response.pipe(file);
    
       // after download completed close filestream
       file.on("finish", () => {
           file.close();
           console.log("Download Completed");
       });
    });
}

module.exports = getData;