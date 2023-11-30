// On initialise la latitude et la longitude de Paris (centre de la carte)
var lat = 48.852969;
var lon = 2.349903;
var macarte = null;
// Fonction d'initialisation de la carte
 function initMap() {
    id = 0;
    // Créer l'objet "macarte" et l'insèrer dans l'élément HTML qui a l'ID "map"
    macarte = L.map('map').setView([lat, lon], 11);
    var tiles = L.esri.basemapLayer("Streets").addTo(macarte);
  
    // create the geocoding control and add it to the map
    var searchControl = L.esri.Geocoding.geosearch({
      position: 'topright',
        placeholder: 'Rechercher une adresse',
        expanded: true,
      providers: [
        L.esri.Geocoding.arcgisOnlineProvider({
          // API Key to be passed to the ArcGIS Online Geocoding Service
          apikey: 'AAPKeb41583c42d642fd87e2c6832ddbb9ceQ3-KB8OS5RMs39Gsjcx4TcSSMwgrOtwinYaRJIZCy_SMfgXA7QhlN2TNW9S07nLL',
        })
      ]
    }).addTo(macarte);

    // create an empty layer group to store the results and add it to the map
    var results = L.layerGroup().addTo(macarte);

    // listen for the results event and add every result to the map
    searchControl.on("results", function (data) {
    });
    markerClusters = L.markerClusterGroup(); // Nous initialisons les groupes de marqueurs
    macarte.setZoom(8);
    // Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut. Nous devons lui préciser où nous souhaitons les récupérer. Ici, openstreetmap.fr
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        // Il est toujours bien de laisser le lien vers la source des données
        attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 1,
        maxZoom: 20
    }).addTo(macarte);
    fetch('/dataLocalisation')
        .then(response => response.json())
        .then(data => {
            var markerClusters = L.markerClusterGroup();
            var markers = [];

            data.forEach( coords => {
                var marker = L.marker([coords.latitude, coords.longitude]);
                var myID = id; // Store the ID in a separate variable
                marker.myID = myID;
                var popup = L.popup('Loading...');
                marker.bindPopup('Loading...');
                marker.on('click', function () {
                    // Make a POST fetch request with the id in the body
                    fetch('/data', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id: myID }),
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        coordonnate = data.properties.coordonneesXY.split(',');
                        x = coordonnate[0];
                        y = coordonnate[1];
                        // remove the first character of x and the first and last character of y
                        x = x.substring(1);
                        y = y.substring(1, y.length - 1);
                        console.log(x + ',' + y);
                        // Update the popup content with the result of the fetch request
                        marker.getPopup().setContent("<p class='title_popup'>" + data.properties.nom_amenageur + "</p><div class='div_popup'><div class='section_popup'><p>Adresse 📌: " +
                         data.properties.adresse_station + '</p></div><div class="section_popup"><p>Nombre de prise de charges🔌: ' + data.properties.nbre_pdc + '</p></div>'
                         + '<div class="section_popup"><p>Puissance nominal⚡️: ' + data.properties.puissance_nominale +
                         ' kW</p></div></div><button class="button_popup" onClick=\"window.open(\'https://www.google.com/maps/dir/?api=1&origin=Ma Position&destination='
                         + data.properties.adresse_station + '\')\"> Itinéraire Google maps</button><button class="button_popup" onClick=\"window.open(\'https://waze.com/ul?ll=' + y + ',' + x + '\')\"> Itinéraire Waze</button>');
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        marker.getPopup().setContent("Error: " + error.message);
                    });
                });
                markers.push(marker);
                id++;
            });
            markerClusters.addLayers(markers);
            macarte.addLayer(markerClusters); // Nous ajoutons le groupe de marqueurs à la carte
        })
        .catch(error => console.error(error));
}
window.onload = function () {
    // Fonction d'initialisation qui s'exécute lorsque le DOM est chargé
    initMap();
    let input_container = document.getElementsByClassName('geocoder-control').item(0);
    input_container.style.height = '50px';
    input_container.firstChild.style.width = '100%';
    input_container.firstChild.style.height = '100%';
    input_container.firstChild.style.border = 'none';
    input_container.firstChild.style.outline = 'none';
    input_container.firstChild.style.fontSize = '16px';
    input_container.firstChild.style.fontFamily = 'Arial';
    input_container.firstChild.style.position = 'inherit';
    input_container.firstChild.style.padding = '0px 10px';
};