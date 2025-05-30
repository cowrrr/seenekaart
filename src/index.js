var parse_georaster = require("georaster");
var GeoRasterLayer = require("georaster-layer-for-leaflet");
// or: import GeoRasterLayer from "georaster-layer-for-leaflet";
// initalize leaflet map
var map = L.map('map').setView([58.378025, 26.728493], 6);
// add OpenStreetMap basemap
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
console.time('processing time');
console.log('started processing');
var url_to_geotiff_file = "dist/data.tif";
fetch(url_to_geotiff_file)
    .then(function (response) { return response.arrayBuffer(); })
    .then(function (arrayBuffer) {
    parse_georaster(arrayBuffer).then(function (georaster) {
        console.log("georaster:", georaster);
        var layer = new GeoRasterLayer({
            georaster: georaster,
            opacity: 0.7,
            pixelValuesToColorFn: function (values) { return values[0] == 1 ? '#ffa500' : ''; },
            resolution: 64 // optional parameter for adjusting display resolution
        });
        layer.addTo(map);
        map.fitBounds(layer.getBounds());
        console.timeEnd('processing time');
    });
});
