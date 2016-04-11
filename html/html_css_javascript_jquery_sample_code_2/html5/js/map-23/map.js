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


function drawPoint(x,y){
	mapContext.beginPath();
	mapContext.arc();
}