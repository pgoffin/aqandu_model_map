import "./styles.scss";

import * as mapboxgl from 'mapbox-gl';
import * as Papa from 'papaparse';
// import fs;
// import { readFile } from 'fs';
// const fs = require('fs');

// console.log("Hello, World!");

// import 'mapbox.js';

// import * as mapbox from 'mapbox.js';

// var client = new MapboxClient('YOUR_ACCESS_TOKEN');
//
//
// this.assign(mapboxgl, "pk.eyJ1Ijoib3NjYXJpbnNsYyIsImEiOiJjajZ3bG5kbnUxN2h3Mnd1aDdlOTJ6ZnUzIn0.fLYowxdcPCmZSLt51mG8tw", this.accessToken);

// mapboxgl.accessToken = 'pk.eyJ1Ijoib3NjYXJpbnNsYyIsImEiOiJjajZ3bG5kbnUxN2h3Mnd1aDdlOTJ6ZnUzIn0.fLYowxdcPCmZSLt51mG8tw';
(mapboxgl as any).accessToken = 'pk.eyJ1Ijoib3NjYXJpbnNsYyIsImEiOiJjajZ3bG5kbnUxN2h3Mnd1aDdlOTJ6ZnUzIn0.fLYowxdcPCmZSLt51mG8tw';

var map:any = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/oscarinslc/cjm9kvqsh094z2rmpymspw2va', // stylesheet location
    center: [-111.8896, 40.748808], // starting position [lng, lat]
    zoom: 11 // starting zoom
});


// fs.readFile('.data/AQ_fireworks_event_sensors-file.csv', 'utf8', function(err: any, data: any) {
//     if (err) throw err;
//     console.log(data);
// });



let sensorLocations: Array<Array<number>> = [];

Papa.parse("/data/AQ_fireworkse_event_sensors.csv", {
  header: true,
  download: true,
  skipEmptyLines: true,
  // Here this is also available. So we can call our custom class method
  // complete: this.updateData
  complete: function(result) {
              console.log(result);
              result.data.forEach(function(aSensor: any) {
                let aLat = parseFloat(aSensor['lat']);
                let aLong = parseFloat(aSensor['long']);
                sensorLocations.push([aLong, aLat]);
              })
            }
});


export class Data {
  static updateData(result: any) {
    const data = result.data;
    console.log(data);
  }
}

map.on('load', function () {

    map.addLayer({
        'id': 'AQ&U_border',
        'type': 'line',
        'source': {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [[[-112.001349, 40.598850],     // (x, y)
                        [-111.713403, 40.598850],
                        [-111.713403, 40.810476],
                        [-112.001349, 40.810476],
                        [-112.001349, 40.598850]]]
                }
            }
        },
        'layout': {},
        'paint': {
            'line-color': '#000',
            'line-opacity': 1,
            'line-width': 2
        }
    });

    map.addLayer({
        'id': 'DAQ_stations',
        'type': 'symbol',
        'source': {
            'type': 'geojson',
            'data': {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [-111.8721, 40.7343]
                    },
                    "properties": {
                          "title": "DAQ: Hawthorne",
                          "icon": "star"
                    }
                }, {
                  "type": "Feature",
                  'geometry': {
                      'type': 'Point',
                      'coordinates': [-111.9309, 40.7955]
                  },
                  "properties": {
                        "title": "DAQ: Rose Park",
                        "icon": "star"
                  }
                }]
            }
        },
        'layout': {
            "icon-image": "{icon}-15",
            "text-field": "{title}",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0.6],
            "text-anchor": "top"
        },
        // 'paint': {
        //     'circle-color': '#000',
        //     'circle-radius': 6,
        //     // 'line-width': 2
        //     // 'fill-color': '#000',
        //     'circle-opacity': 1
        // }
    });


    const allSensors = sensorLocations.map(aSensorLocation => ({
      "type": "Feature",
      'geometry': {
          'type': 'Point',
          'coordinates': aSensorLocation
      }
    }));

    map.addLayer({
        'id': 'sensorLocations',
        'type': 'circle',
        'source': {
            'type': 'geojson',
            data: {
                type: 'FeatureCollection',
                features: allSensors
            }
        }
    })

    var scale = new mapboxgl.ScaleControl({
      maxWidth: 80,
      unit: 'metric'
    });
    map.addControl(scale);

});
