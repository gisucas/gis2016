/**
	定义地图相关函数
*/
var mapContext = null;
var mapCanvas = null;

// 地图范围
var mapExtent = {
	xmin : -180,
	ymin : -90,
	xmax : 180,
	ymax : 90
};

// 按照canvas调整之后的地图范围
var mapViewer = null;
	
// 屏幕距离与地图距离的比例尺
var scale = null;

function createMapCanvas(){
	var map_div = $("#map_div");
	var height = map_div.height();
	var width = map_div.width();
	var canvasHtml = "<canvas id='map_canvas' width='" + width 
		+ "' height='" + height + "'></canvas>";
	map_div.html(canvasHtml);
	mapCanvas = document.getElementById("map_canvas");
	if(mapCanvas == null){
		return;
	}
	mapContext = mapCanvas.getContext("2d");
	console.log(mapExtent);
	mapViewer = scaleView(mapExtent);
	console.log(mapViewer);

	scale = getSacle();

	var imageUrl = "img/world-raster.png";
	drawImage(imageUrl,mapExtent);
}



function scaleView(extent){
	if(extent == null){
		return;
	}
	var canvasHeight = mapCanvas.height;
	var canvasWidth = mapCanvas.width;

	var extentWidth = mapExtent.xmax - mapExtent.xmin;
	var extentHeight = mapExtent.ymax - mapExtent.ymin;

	var v_scale = extentWidth / extentHeight;
	var w_scale = canvasWidth / canvasHeight;

	var center_x = ( mapExtent.xmax + mapExtent.xmin ) / 2;
	var center_y = ( mapExtent.ymax + mapExtent.ymin ) / 2;

	var mapViewer = null;

	if(v_scale > w_scale){
		//strech height
		var w_2 = extentWidth / 2 ;
		var h_2 = w_2 / w_scale;
		mapViewer = {
			xmin : mapExtent.xmin,
			ymin : center_y - h_2,
			xmax : mapExtent.xmax,
			ymax : center_y + h_2
		};
	}else{
		//strech width
		var h_2 = extentHeight / 2;
		var w_2 = h_2 * w_scale;
		mapViewer = {
			xmin : center_x - w_2,
			ymin : mapExtent.ymin,
			xmax : center_y + w_2,
			ymax : mapExtent.ymax
		};
	}
	return mapViewer;
}


function getSacle(){
	if(mapCanvas == null || mapContext == null || mapViewer == null){
		return null;
	}

	var viewerHeight =  mapViewer.ymax - mapViewer.ymin;
	var viewerWidth = mapViewer.xmax - mapViewer.xmin;

	var canvasHeight = mapCanvas.height;
	var canvasWidth = mapCanvas.width;

	var scale_x = canvasWidth / viewerWidth;
	var scale_y = canvasHeight / viewerHeight;

	console.log("scale_x : " + scale_x + "; scale_y : " + scale_y);
	var scale = scale_x < scale_y ? scale_x : scale_y;
	return scale;
}

function toMapPoint(sx,sy){
	var viewerCenter_x = ( mapViewer.xmin + mapViewer.xmax ) / 2;
	var viwerCenter_y = (mapViewer.ymin + mapViewer.ymax ) / 2;

	var screenHeight_2  =  mapCanvas.height / 2;
	var screenWidth_2 = mapCanvas.width / 2;

	var mapX = (sx - screenWidth_2) / scale  + viewerCenter_x;
	var mapY = (screenHeight_2 - sy) / scale + viwerCenter_y;
	return {
		x : mapX,
		y : mapY
	};
}

function toScreenPoint(mx,my){
	var viewerCenter_x = ( mapViewer.xmin + mapViewer.xmax ) / 2;
	var viwerCenter_y = (mapViewer.ymin + mapViewer.ymax ) / 2; 

	var screenHeight_2  =  mapCanvas.height / 2;
	var screenWidth_2 = mapCanvas.width / 2;

	var screenX = scale * (mx - viewerCenter_x) + screenWidth_2;
	var screenY = screenHeight_2 -  scale * (my - viwerCenter_y);
	return {
		x : screenX,
		y : screenY
	};
}


function drawImage(url,extent){
	var image = new Image();
	image.src = url;
	image.onload = function(){
		var width = this.width;
		var height = this.height;

		var leftTop = toScreenPoint(-180,90);
		var rightBottom  = toScreenPoint(180,-90);

		var imageScreenWidth = rightBottom.x - leftTop.x;
		var imageScreenHeight = rightBottom.y -leftTop.y;

		mapContext.drawImage(this,0,0,width,height,
			leftTop.x,leftTop.y,imageScreenWidth,imageScreenHeight);
	};
}

// 绘制点
function drawPoint(x,y,pointStyle){
	if(x == null || y == null || pointStyle == null || mapContext == null){
		return;
	}
	if(pointStyle.fill != null){
		mapContext.fillStyle = pointStyle.fill;
	}
	if(pointStyle.stroke != null){
		mapContext.strokeStyle = pointStyle.stroke;
	}
	if(pointStyle.strokeWidth != null){
		mapContext.lineWidth = pointStyle.strokeWidth;
	}
	mapContext.beginPath();
	var srceenPoint = toScreenPoint(x,y);
	mapContext.arc(srceenPoint.x,srceenPoint.y,pointStyle.size,0,Math.PI * 2,true);
	if(pointStyle.fill != null){
		mapContext.fill();
	}
	if(pointStyle.stroke != null){
		mapContext.stroke();
	}
}


function drawPointTest(){
	var pointStyle = {
		size : 6,
		fill : "#FF0000",
		stroke : "#00FF00",
		strokeWidth : 1
	};
	drawPoint(116,39,pointStyle);
}


// 绘制线
function drawLine(line,lineStyle){
	if(line == null || lineStyle == null ||mapContext == null){
		return;
	}

	if(lineStyle.stroke != null){
		mapContext.strokeStyle = lineStyle.stroke;
	}
	if(lineStyle.strokeWidth != null){
		mapContext.lineWidth = lineStyle.strokeWidth;
	}

	var points = line.points;
	if(points == null){
		return;
	}
	var pt = null;
	var spt = null;
	pt = points[0];
	spt = toScreenPoint(pt.x,pt.y);
	mapContext.beginPath(); 
	mapContext.moveTo(spt.x,spt.y);

	for(var i = 1;i < points.length;++i){
		pt = points[i];
		spt = toScreenPoint(pt.x,pt.y);
		mapContext.lineTo(spt.x,spt.y);
	}
	mapContext.stroke();
}


function drawLineTest(){
	var line = {
		points : [{
			x : 110,
			y : 10
		},{
			x : 86,
			y : 40
		},{
			x : 0,
			y : -40
		}]
	};

	var lineStyle = {
		stroke : "#0000FF",
		strokeWidth : 2
	};	

	drawLine(line,lineStyle);
}

// 绘制面
function drawPolygon(polygon,polygonStyle){
	if(polygon == null || polygonStyle == null || mapContext == null){
		return;
	}

	if(polygonStyle.fill != null){
		mapContext.fillStyle = polygonStyle.fill;
	}
	if(polygonStyle.stroke != null){
		mapContext.strokeStyle = polygonStyle.stroke;
	}
	if(polygonStyle.strokeWidth != null){
		mapContext.lineWidth = polygonStyle.strokeWidth;
	}

	var pt = null;
	var spt = null;
	var ring = null;
	var pointsNum = null;
	var points = null;

	mapContext.beginPath();
	var rings = polygon.rings;
	for(var i = 0; i < rings.length; ++i){
		ring = rings[i];
		points = ring.points;
		pt = points[0];
		spt = toScreenPoint(pt.x,pt.y);
		mapContext.moveTo(spt.x,spt.y);
		for(var j = 1;j < points.length;++j){
			pt = points[j];
			spt = toScreenPoint(pt.x,pt.y);
			mapContext.lineTo(spt.x,spt.y);
		}
		if(polygonStyle.fill != null){
			mapContext.fill();
		}
		if(polygonStyle.stroke != null){
			mapContext.stroke();
		}
	}
	mapContext.closePath();
}

function drawPolygonTest(){
	var polygon = {
		rings :[{
			points : [{
				x : -45,
				y : 51
			},{
				x : -10,
				y : 63
			},{
				x : 40,
				y : 0
			},{
				x : -23,
				y : 3
			},{
				x : -45,
				y : 51
			}]
		},]
	};

	var polygonStyle = {
		// fill : "#006dcc",
		fill : "rgba(0,109,204,0.6)",
		stroke : "#00FF00",
		strokeWidth : 1
	};
	drawPolygon(polygon,polygonStyle);
}


// 绘制文字
function drawText(text,x,y,textStyle){
	if(text == null || x == null || y == null ||
		textStyle == null || mapContext == null){
		return;
	}
	if(textStyle.font != null){
		mapContext.font = textStyle.font;
	}
	if(textStyle.fill != null){
		mapContext.fillStyle = textStyle.fill;
	}
	if(textStyle.stroke != null){
		mapContext.strokeStyle = textStyle.stroke;
	}
	if(textStyle.strokeWidth != null){
		mapContext.lineWidth = textStyle.strokeWidth;
	}

	var spt = toScreenPoint(x,y);
	if(textStyle.fill != null){
		mapContext.fillText(text,spt.x,spt.y);
	}
	if(textStyle.stroke != null){
		mapContext.strokeText(text,spt.x,spt.y);
	}
}

function drawTextTest(){
	var text = "这里是北京";
	var textStyle = {
		font : "20px Microsoft YaHei",
		stroke : "#FFFF00",
		strokeWidth : 1,
		fill : "#FF0000"
	};
	var x = 116;
	var y = 39;
	drawText(text,x,y,textStyle);
}

// 清空地图
function clearMap(){
	if(mapContext == null || mapCanvas == null){
		return;
	}
	var height = mapCanvas.height;
	var width = mapCanvas.width;
	mapContext.clearRect(0,0,width,height);
}

function drawWorldImage(){
	var imageUrl = "img/world-raster.png";
	drawImage(imageUrl,mapExtent);
}


// 绘制cities点
function drawCities(){
	var url = "cities.xml";
	var pointStyle = {
		size : 3,
		fill : "rgba(255,0,0,0.8)",
	};
	var textStyle = {
		font : "10px Microsoft YaHei",
		fill : "rgba(180,180,180,1)"
	};
	$.get(url,function(xml){
		var cities = parseCitiesXML(xml);
		if(cities == null){
			return;
		}
		var city = null;
		var x = null;
		var y = null;
		var name = null;
		for(var i = 0; i < cities.length;++i){
			city = cities[i];
			x = city.x;
			y = city.y;
			name = city.name;
			drawPoint(x,y,pointStyle);
			// drawText(name,x,y,textStyle);
		}
	});
}

function parseCitiesXML(xml){
	if(xml == null){
		return null;
	}
	var cities = [];
	$(xml).find("featureMember").each(function(){
		var name = $(this).find("name").text();
		var coordinates = $(this).find("coordinates").text();
		var array = coordinates.split(",");
		var x = array[0];
		var y = array[1];
		var city = {
			name : name,
			x : x,
			y : y
		};
		cities.push(city);
	});
	return cities;
}

// 绘制多线
function drawMultiLine(multiLine,lineStyle){
	if(multiLine == null|| lineStyle == null || mapContext == null){
		return;
	}	
	if(lineStyle.stroke != null){
		mapContext.strokeStyle = lineStyle.stroke;
	}
	if(lineStyle.strokeWidth != null){
		mapContext.lineWidth = lineStyle.strokeWidth;
	}
	
	var line = null;
	var pt = null;
	var spt = null;
	var points = null;

	mapContext.beginPath();
	for(var i = 0; i < multiLine.length;++i){
		line = multiLine[i];
		points = line.points;
		pt = points[0];
		spt = toScreenPoint(pt.x,pt.y);
		mapContext.moveTo(spt.x,spt.y);
		for(var j = 1; j < points.length;++j){
			pt = points[j];
			spt = toScreenPoint(pt.x,pt.y);
			mapContext.lineTo(spt.x,spt.y);
		}

		mapContext.stroke();
	}
}

function drawMultiLineTest(){
	var multiLine = [
		{
			points : [{
				x : 110,
				y : 10
			},{
				x : 86,
				y : 40
			},{
				x : 0,
				y : -40
			}]
		},{
			points : [{
				x : -80,
				y : 40
			},{
				x : -110,
				y : 10
			},{
				x : 16,
				y : 20
			},{
				x : 12,
				y : -10
			}]
		}		
	];
	var lineStyle = {
		stroke : "#0000FF",
		strokeWidth : 2
	};
	drawMultiLine(multiLine,lineStyle);
}

// 绘制rivers线
function drawRivers(){
	var url = "rivers.xml";
	var lineStyle = {
		stroke : "#0000FF",
		strokeWidth : 2
	};
	$.get(url,function(xml){
		var rivers = praseRiversXML(xml);
		if(rivers == null){
			return;
		}
		for(var i = 0; i < rivers.length;++i){
			var river = rivers[i];
			drawMultiLine(river,lineStyle);
		}
	});
}

function praseRiversXML(xml){
	if(xml == null){
		return null;
	}
	var rivers = [];
	$(xml).find("lineStringMember").each(function(){
		var multiLine = [];
		$(this).find("LineString").each(function(){
			var lineStringPoints = []; 
			var coordinates = $(this).find("coordinates").text();
			var pts = coordinates.split(" ");
			for(var i = 0; i < pts.length; ++i){
				var pointStr = pts[i];
				var pointArray = pointStr.split(",");
				var pt = {
					x : pointArray[0],
					y : pointArray[1]
				};
				lineStringPoints.push(pt);
			}
			var lineString = {
				points : lineStringPoints
			};
			multiLine.push(lineString);
		});
		rivers.push(multiLine);
	});
	return rivers;
}

// 绘制多面
function drawMultiPolygon(multiPolygon,polygonStyle){
	if(multiPolygon == null || polygonStyle == null){
		return;
	}
	if(polygonStyle.fill != null){
		mapContext.fillStyle = polygonStyle.fill;
	}
	if(polygonStyle.stroke != null){
		mapContext.strokeStyle = polygonStyle.stroke;
	}
	if(polygonStyle.strokeWidth != null){
		mapContext.lineWidth = polygonStyle.strokeWidth;
	}

	var polygon = null;
	var rings = null;
	var ring = null;
	var pt = null;
	var spt = null;
	
	for(var i = 0; i < multiPolygon.length;++i){
		polygon = multiPolygon[i];

		rings = polygon.rings;
		for(var j = 0; j < rings.length;++j){
			ring = rings[j];
			points = ring.points;
			pt = points[0];
			spt = toScreenPoint(pt.x,pt.y);
			mapContext.beginPath();
			mapContext.moveTo(spt.x,spt.y);
			for(var k = 1; k < points.length; ++k){
				pt = points[k];
				spt = toScreenPoint(pt.x,pt.y);
				mapContext.lineTo(spt.x,spt.y);
			}
			mapContext.closePath();
			if(polygonStyle.fill != null){
				mapContext.fill();
			}
			if(polygonStyle.stroke != null){
				mapContext.stroke();
			}
		}
	}
	
}

function drawMultiPolygonTest(){
	var polygon1 = {
		rings :[{
			points : [{
				x : -45,
				y : 51
			},{
				x : -10,
				y : 63
			},{
				x : 40,
				y : 0
			},{
				x : -23,
				y : 3
			},{
				x : -45,
				y : 51
			}]
		},]
	};

	var polygon2 = {
		rings :[{
			points : [{
				x : 78,
				y : 39
			},{
				x : 106,
				y : 8
			},{
				x : 134,
				y : 45
			},{
				x : 78,
				y : 39
			}]
		},]
	};

	var multiPolygon = [polygon1,polygon2];
	
 	var polygonStyle = {
		fill : "rgba(0,109,204,0.6)",
		stroke : "#00FF00",
		strokeWidth : 1
	};
	drawMultiPolygon(multiPolygon,polygonStyle);
}


function drawCountry(){
	var url = "country.xml";
	var polygonStyle = {
		fill : "rgba(130,111,14,1)",
		stroke : "#d9cf82",
		strokeWidth : 1
	};
	$.get(url,function(xml){
		var countryArray = parseCountryXML(xml);
		if(countryArray == null){
			return;
		}
		for(var i = 0; i < countryArray.length; ++i){
			var country = countryArray[i];
			drawMultiPolygon(country,polygonStyle);
		}
	});
}


function parseCountryXML(xml){
	if(xml == null){
		return null;
	}
	var countryArray = [];
	$(xml).find("featureMember").each(function(){
		var country = []; 
		var name = $(this).find("name").text();
		$(this).find("polygonMember").each(function(){
			var rings = [];
			$(this).find("Polygon").each(function(){
				$(this).find("LinearRing").each(function(){
					var ringPoints = []; 
					var coordinates = $(this).find("coordinates").text();
					var pts = coordinates.split(" ");
					for(var i = 0; i < pts.length; ++i){
						var pointStr = pts[i];
						var pointArray = pointStr.split(",");
						var pt = {
							x : pointArray[0],
							y : pointArray[1]
						};
						ringPoints.push(pt);
					}
					var ring = {
						points: ringPoints
					};
					rings.push(ring);
				});
			});
			var countryPolygon = {
				rings : rings
			};
			country.push(countryPolygon);
		});
		countryArray.push(country);
	});
	return countryArray;
}
