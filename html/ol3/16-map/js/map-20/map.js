var mapObj = null;

function initMap(){
    mapObj = new ol.Map({
        target: 'map_div',    
        layers: [             
           new ol.layer.Tile({
                source: new ol.source.OSM({
                    url: 'http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
                })
            })
        ],
        view: new ol.View({  
            center: ol.proj.fromLonLat([0, 0]),
            zoom: 1
        })
    });
}


