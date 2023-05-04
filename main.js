/* Vienna Sightseeing Beispiel */

// Stephansdom Objekt
let stephansdom = {
    lat: 48.208493,
    lng: 16.373118,
    title: "Stephansdom"
};

// Karte initialisieren
let map = L.map("map").setView([
    stephansdom.lat, stephansdom.lng
], 15);
    map.addControl(new L.Control.Fullscreen());

// Thematische Layer
let themaLayer = {
    stops: L.featureGroup(),
    lines: L.featureGroup(),
    sights: L.featureGroup(),
    zones: L.featureGroup(),
    hotels: L.markerClusterGroup({disableClusteringAtZoom: 17})
}

// Hintergrundlayer
let layerControl = L.control.layers({
    "BasemapAT Grau": L.tileLayer.provider("BasemapAT.grau").addTo(map),
    "BasemapAT Standard": L.tileLayer.provider("BasemapAT.basemap"),
    "BasemapAT High-DPI": L.tileLayer.provider("BasemapAT.highdpi"),
    "BasemapAT Gelände": L.tileLayer.provider("BasemapAT.terrain"),
    "BasemapAT Oberfläche": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT Beschriftung": L.tileLayer.provider("BasemapAT.overlay")
},{
    "Vienna Sightseeing Haltestellen": themaLayer.stops,
    "Vienna Sightseeing Linie": themaLayer.lines,
    "Vienna Sightseeing Fußgängerzonen": themaLayer.zones,
    "Vienna Sightseeing Sehenswürdigkeiten": themaLayer.sights,
    "Vienna Sightseeing Hotels": themaLayer.hotels.addTo(map)
}).addTo(map);

// Marker Stephansdom
//L.marker([
//    stephansdom.lat, stephansdom.lng
//]).addTo(map).bindPopup(stephansdom.title).openPopup();

// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);

//Vienna Sightseeing Haltestellen

async function showStops(url){
    let response = await fetch(url);
    let jsondata = await response.json();
    L.geoJSON(jsondata)//addTo(themaLayer.stops)
    //console.log(response, jsondata)
    L.geoJSON(jsondata, {
        pointToLayer: function(feature, latlng) {
             return L.marker(latlng, {
                 icon: L.icon({
                     iconUrl: `icons/bus_${feature.properties.LINE_ID}.png`,
                     iconAnchor: [16, 37],
                     popupAnchor: [0, -37],
                 })
             });
         },
        onEachFeature: function(feature, layer){
            let prop = feature.properties;
            layer.bindPopup(`
            <h4><i class="fa-solid fa-bus"><a>&ensp;</a></i>${prop.LINE_NAME}</h4>
            <address>${prop.STAT_ID}&ensp;${prop.STAT_NAME}</address>
            `);
            //console.log(feature.properties, prop.LINE_NAME);
        }
    }).addTo(themaLayer.stops);
}

showStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json");


async function showLines(url){
    let response = await fetch(url);
    let jsondata = await response.json();
    let lineNames = {};
    let lineColors = {
        "1": "#FF4136", //'Red Line',
        "2": "#FFDC00", //'Yellow Line', 
        "3": "#0074D9", //'Blue Line', 
        "4": "#2ECC40", //'Green Line', 
        "5": "#AAAAAA", //'Grey Line', 
        "6": "#FF851B",  //'Orange Line'
    }
    L.geoJSON(jsondata)//addTo(themaLayer.lines)
    //console.log(response, jsondata)
    L.geoJSON(jsondata, 
    {
            style: function (feature) {
                return {
                    color: lineColors[feature.properties.LINE_ID],
                    weight: 3,
                    dashArray:[10, 6]
                };
            },
        onEachFeature: function(feature, layer){
            let prop = feature.properties;
            layer.bindPopup(`
            <h4><i class="fa-solid fa-bus"><a>&ensp;</a></i>${prop.LINE_NAME}</h4>
            <address><i class="fa-regular fa-circle-stop">&ensp;</i>${prop.FROM_NAME}</address>
            <i class="fa-solid fa-arrow-down"></i>
            <address><i class="fa-regular fa-circle-stop">&ensp;</i>${prop.TO_NAME}</adress>
            `);
            //console.log(prop.LINE_NAME)
            //console.log(feature.properties, prop.LINE_NAME);
            lineNames[prop.LINE_ID] = prop.LINE_NAME;
            //console.log(lineNames)
        }
    }).addTo(themaLayer.lines);
}

showLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json");


async function showSights(url){
    let response = await fetch(url);
    let jsondata = await response.json();
    L.geoJSON(jsondata)//addTo(themaLayer.sights)
    //console.log(response, jsondata)
    L.geoJSON(jsondata, {
        pointToLayer: function(feature, latlng) {
           // L.marker(latlng).addTo(map);
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: 'icons/photo.png',
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37],
                })
            });
        },

        onEachFeature: function(feature, layer){
            let prop = feature.properties;
            layer.bindPopup(`
            <img src = "${prop.THUMBNAIL}" alt = "*")>
            <h4><a ref = "${prop.WEITERE_INF}" target = "Wien">${prop.NAME}</a></h4>
            <address>${prop.ADRESSE}</address>
            `);
            //console.log(feature.properties, prop.NAME);
        }
    }).addTo(themaLayer.sights);
}

showSights("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json");


async function showZones(url){
    let response = await fetch(url);
    let jsondata = await response.json();
    L.geoJSON(jsondata)//addTo(themaLayer.zones)
    //console.log(response, jsondata)
    L.geoJSON(jsondata, {
            style: function (feature) {
             return {
                    color: "#F012BE",
                    weight: 1,
                    fillOpacity: 0.1,
                    opacity: 0.4,  
                 };
        },
        onEachFeature: function(feature, layer){
            let prop = feature.properties;
            layer.bindPopup(`
            <h4>Fußgängerzone<a>&ensp;</a></i>${prop.ADRESSE}</h4>
            <p><i class="fa-regular fa-clock"></i>&ensp;${prop.ZEITRAUM || "dauerhaft"}</p>
            <p><i class="fa-sharp fa-solid fa-circle-info"></i>&ensp;${prop.AUSN_TEXT || "keine Ausnahmen"}</p>
            `);
            //console.log(feature.properties, prop.ADRESSE);
        }
    }).addTo(themaLayer.zones);
}

showZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json");


async function showHotels(url){
    let response = await fetch(url);
    let jsondata = await response.json();
    L.geoJSON(jsondata)//addTo(themaLayer.hotels)
    //console.log(response, jsondata)
    L.geoJSON(jsondata, {
        pointToLayer: function(feature, latlng) {
            let prop = feature.properties;
            let hotelStars = prop.KATEGORIE_TXT;
           // L.marker(latlng).addTo(map);
           if (hotelStars === "1*"){
                return L.marker(latlng, {icon: L.icon({iconUrl: 'icons/hotel_1star.png', iconAnchor: [16, 37], popupAnchor: [0, -37],})});
            } else if (hotelStars === "2*"){
                return L.marker(latlng, {icon: L.icon({iconUrl: 'icons/hotel_2stars.png', iconAnchor: [16, 37], popupAnchor: [0, -37],})}); 
                   
            } else if (hotelStars === "3*"){
                return L.marker(latlng, {icon: L.icon({iconUrl: 'icons/hotel_3stars.png', iconAnchor: [16, 37], popupAnchor: [0, -37],})}); 
                   
            } else if (hotelStars === "4*"){
                return L.marker(latlng, {icon: L.icon({iconUrl: 'icons/hotel_4stars.png', iconAnchor: [16, 37], popupAnchor: [0, -37],})}); 
                   
            } else if (hotelStars === "5*"){
                return L.marker(latlng, {icon: L.icon({iconUrl: 'icons/hotel_5stars.png', iconAnchor: [16, 37], popupAnchor: [0, -37],})}); 
                    
            } else if (hotelStars === "nicht kategorisiert"){
                return L.marker(latlng, {icon: L.icon({iconUrl: 'icons/hotel_0star.png', iconAnchor: [16, 37], popupAnchor: [0, -37],})}); 
                    
            } else {
                return L.marker(latlng, {icon: L.icon({iconUrl: 'icons/hotel.png', iconAnchor: [16, 37], popupAnchor: [0, -37],})}); 
                    
            }
        },

        onEachFeature: function(feature, layer){
            let prop = feature.properties;
            layer.bindPopup(`
            <h3>${prop.BETRIEB}</h3>
            <h4>${prop.BETRIEBSART_TXT}&ensp;${prop.KATEGORIE_TXT}</h4>
            <hr></hr>
            Adr.: ${prop.ADRESSE} <br>
            Tel.: <a href = "tel:${prop.KONTAKT_TEL}">${prop.KONTAKT_TEL}</a><br>
            Mail: <a href= "mailto:${prop.KONTAKT_EMAIL}"> ${prop.KONTAKT_EMAIL}</a><br>
            Homepage: <a href="${prop.WEBLINK1}"> ${prop.WEBLINK1}</a>
          

            `);
            //console.log(feature.properties, prop.NAME);
        }
    }).addTo(themaLayer.hotels);
}

showHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json")