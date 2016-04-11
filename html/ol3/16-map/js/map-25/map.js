var mapObj = null;
var poiVector = null;

var popup = null;

// 定位到的poiSelected
var poiSelected = null;

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
            name: name,
        });
        feature.setId(i);
        feature.setStyle(iconStyle);
        source.addFeature(feature);
    }
}

// 获取地图的范围
function getMapExtent(){
    if(mapObj == null){
        return null;
    }
    var view = mapObj.getView();
    var size = mapObj.getSize();
    var extent = view.calculateExtent(size);
    var leftBottom = ol.proj.toLonLat([extent[0],extent[1]]);
    var rightTop = ol.proj.toLonLat([extent[2],extent[3]]);
    var xmin = parseFloat(leftBottom[0].toFixed(6));
    var ymin = parseFloat(leftBottom[1].toFixed(6));
    var xmax = parseFloat(rightTop[0].toFixed(6));
    var ymax = parseFloat(rightTop[1].toFixed(6));
    return {
        xmin : xmin,
        ymin : ymin,
        xmax : xmax,
        ymax : ymax
    };
}


function showSelectedPoi(id){
    var iconStyle = new ol.style.Style({
        image: new ol.style.Icon(({
            src: 'img/marker.png'
        }))
    });

    if(poiSelected != null){
        poiSelected.setStyle(iconStyle);
    }
    var feature = poiVector.getSource().getFeatureById(id);
    if(feature == null){
        return;
    }
    poiSelected = feature;
    var iconSelectedStyle = new ol.style.Style({
        image: new ol.style.Icon(({
            src: 'img/marker-2.png'
        }))
    });

    var name = feature.getProperties()['name'];
    
    var textStyle = new ol.style.Style({
        text: new ol.style.Text({
            textAlign: 'left',            //水平方向中间对齐
            textBaseline: 'middle',         //垂直方向居中对齐
            font: '10px Microsoft YaHei',   //定义字体和大小
            text: name,                     //定义标注文本
            fill: new ol.style.Fill({       //定义文字填充颜色
                color: 'rgba(255,0,0,1.0)'
            }),
            stroke : new ol.style.Stroke({  //定义文字边框
                color: 'rgba(255,255,255,1.0)',
                width: 4.0
            }),
            offsetX: 8.0,                     //定义X方向偏移量
            offsetY: 0,                     //定义Y方向偏移量
        })
    });
    feature.setStyle([iconSelectedStyle,textStyle]);
}