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
