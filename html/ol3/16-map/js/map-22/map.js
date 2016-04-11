var mapObj = null;
var poiVector = null;

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
            center: ol.proj.fromLonLat([116.3, 39.9]),
            zoom: 10
        })
    });

    // 新增POI图层
    poiVector = new ol.layer.Vector({
        source: new ol.source.Vector()
    });

    mapObj.addLayer(poiVector);
}

// 在地图上展示poi结果
function showPoisInMap(pois){
    var source = poiVector.getSource();
    var iconStyle = new ol.style.Style({
        image: new ol.style.Icon(({
            src: 'img/marker.png'
        }))
    });

    var poiObj = null;
    var name = null,lat = null,lon = null,xy = null,feature = null;
   
    for(var i = 0; i < pois.length;++i){
        poiObj = pois[i];
        name = poiObj.name;
        lat = poiObj.lat;
        lon = poiObj.lon;
        lat = parseFloat(lat);
        lon = parseFloat(lon);
        xy = ol.proj.fromLonLat([lon, lat]);
        feature = new ol.Feature({
            geometry: new ol.geom.Point([xy[0], xy[1]]),
            name: name
        });
        feature.setStyle(iconStyle);
        source.addFeature(feature);
    }
}