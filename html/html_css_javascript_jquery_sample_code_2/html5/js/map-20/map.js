/**
	定义地图相关函数
*/
var mapContext = null;
var mapCanvas = null;

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
}
