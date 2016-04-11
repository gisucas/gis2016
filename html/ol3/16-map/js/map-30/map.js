var mapObj = null;
var poiVector = null;

var popup = null;

// 定位到的poiSelected
var poiSelected = null;
    
// 拉框交互
var dragBox = null;

var markerVector = null;

var drawMarkerInteraction = null;

// 测量draw交互
var drawMeasureInteraction = null;

// 测量矢量图层
var measureVector= null;

// 测量鼠标移动事件
var measureMoveHandler = null;

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
    
    removeAttributionControl();
    addMousePoistion();

    addMarkerVector();
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

function removeAttributionControl(){
    var controls = mapObj.getControls();
    controls.forEach(function(c){
        if(c instanceof ol.control.Attribution){
            mapObj.removeControl(c);
        }
    });
}

// 注册鼠标移动事件
function addMousePoistion(){
    mapObj.on("pointermove",onMousePointMove);
}

// 显示经纬度信息
function onMousePointMove(evt){
    var x = evt.coordinate[0];
    var y = evt.coordinate[1];
    var pos = ol.proj.toLonLat([x,y]);
    var lon = parseFloat(pos[0].toFixed(6));
    var lat = parseFloat(pos[1].toFixed(6));
    $("#position_div span").html(lon + " , " + lat);
}


// function addDragBox(name){
//     if(dragBox == null){
//         dragBox = new ol.interaction.DragBox();
//         mapObj.addInteraction(dragBox);
//     }
   
//     $(".left_panel").hide();
//     $("#result_container_div").show();
//     $(".result_container").remove();
//     dragBox.on("boxend",function(evt){
//         var dragBox = evt.target;
//         var geometry = dragBox.getGeometry();
//         var extent = geometry.getExtent();
//         var leftBottom = ol.proj.toLonLat([extent[0],extent[1]]);
//         var rightTop = ol.proj.toLonLat([extent[2],extent[3]]);
//         var xmin = parseFloat(leftBottom[0].toFixed(6));
//         var ymin = parseFloat(leftBottom[1].toFixed(6));
//         var xmax = parseFloat(rightTop[0].toFixed(6));
//         var ymax = parseFloat(rightTop[1].toFixed(6));
//         var extentObj = {
//             xmin : xmin,
//             ymin : ymin,
//             xmax : xmax,
//             ymax : ymax
//         };

//         $(".result_container").remove();
//         // 清空poi图层上的数据
//         var source = poiVector.getSource();
//         source.clear();
//         getPoi(name,extentObj);

//     });
// }

function addDragBox(name){
    removeDragBox();
    dragBox = new ol.interaction.DragBox();
    mapObj.addInteraction(dragBox);
    $(".left_panel").hide();
    $("#result_container_div").show();
    $(".result_container").remove();
    var source = poiVector.getSource();
    source.clear();
    dragBox.on("boxend",function(evt){
        var dragBox = evt.target;
        var geometry = dragBox.getGeometry();
        var extent = geometry.getExtent();
        var leftBottom = ol.proj.toLonLat([extent[0],extent[1]]);
        var rightTop = ol.proj.toLonLat([extent[2],extent[3]]);
        var xmin = parseFloat(leftBottom[0].toFixed(6));
        var ymin = parseFloat(leftBottom[1].toFixed(6));
        var xmax = parseFloat(rightTop[0].toFixed(6));
        var ymax = parseFloat(rightTop[1].toFixed(6));
        var extentObj = {
            xmin : xmin,
            ymin : ymin,
            xmax : xmax,
            ymax : ymax
        };
         $(".result_container").remove();
        var source = poiVector.getSource();
        source.clear();
        getPoi(name,extentObj);
    });    
}

function removeDragBox(){
    if(dragBox != null){
        mapObj.removeInteraction(dragBox);
    }
    dragBox = null;
}

// 注册标记图层
function addMarkerVector(){
    var source = new ol.source.Vector();
    var iconStyle = new ol.style.Style({
        image: new ol.style.Icon(({
            src: 'img/flag.png'
        }))
    });
    
    markerVector = new ol.layer.Vector({
        source: source,
        style: iconStyle
    });
    mapObj.addLayer(markerVector);
}

// 标记
function addMarker(){
    var source = markerVector.getSource();

    drawMarkerInteraction =  new ol.interaction.Draw({
        source: source,         //Draw之后的Source
        type: 'Point'      //绘制要素的类型
    });

    mapObj.addInteraction(drawMarkerInteraction); 
    source.on("addfeature",function(evt){
        console.log(evt.target);
        mapObj.removeInteraction(drawMarkerInteraction);
    })
}


// 全图显示
function showMapFullExtent(){
    if(mapObj == null){
        return;
    }
    var view = mapObj.getView();
    var projection = view.getProjection();
    var extent = projection.getExtent();
    view.fit(extent,mapObj.getSize());
}

// 测量
function addDrawMeasureInteraction(type){
    if(type == null){
        return;
    }
    removeDrawMeasureInteraction();

    var sketch = null;
    measureMoveHandler = function(evt){
        if(evt.dragging){
            return;
        }

        if(sketch){
            var geometry = sketch.getGeometry();
            if(geometry instanceof ol.geom.Polygon){
                var area = geometry.getArea();
                var result = formatArea(area);
                $("#measure_result").html(result);
            }else if(geometry instanceof ol.geom.LineString){
                var length = geometry.getLength();
                var result = formatLength(length);
                $("#measure_result").html(result);
            }
        }
    }   

    mapObj.on("pointermove",measureMoveHandler);

    var source = new ol.source.Vector();
    measureVector = new ol.layer.Vector({
        source : source
    });
    mapObj.addLayer(measureVector);


    drawMeasureInteraction = new ol.interaction.Draw({
        type : type,
        source : source
    });
    mapObj.addInteraction(drawMeasureInteraction);

    drawMeasureInteraction.on("drawstart",function(evt){
        sketch = evt.feature;
    });
    drawMeasureInteraction.on("drawend",function(evt){
        sketch = null;
    });
}

// 取消测量
function removeDrawMeasureInteraction(){
    if(drawMeasureInteraction != null){
        mapObj.removeInteraction(drawMeasureInteraction);
        drawMeasureInteraction = null;
    }
    mapObj.removeLayer(measureVector);
    if(measureMoveHandler != null){
        mapObj.un("pointermove",measureMoveHandler);
    }
    $("#measure_result").empty();
} 


function formatLength(length){
    length = Math.round(length * 100) / 100;
    var result = null;
    if(length > 100){
        result = (Math.round(length / 1000 * 100) / 100) +
              ' ' + 'km';
    }else{
        result = length + ' ' + 'm'; 
    }
    return result;
}

function formatArea(area){
    var result = null;
    if(area > 10000){
        output = (Math.round(area / 1000000 * 100) / 100) +
              ' ' + 'km<sup>2</sup>';
    }else{
        output = (Math.round(area * 100) / 100) +
              ' ' + 'm<sup>2</sup>';
    }
    return output;
}