$().ready(function(){
	initMap();
	cityEvent();
	poiEvent();
	poiSearchEvent();
});


function cityEvent(){

	$("#city").click(function(){
		var panel = $("#city_div");
		panel.slideToggle();
	});

	$("#pop_city a, .city_item a").click(function(){
		var name = $(this).text();
		$("#current_city span,#city span").html(name);
		var panel = $("#city_div");
		panel.slideUp();
		// 定位
		var position = getCityPosition(name);
		if(position != null){
			var v = mapObj.getView();
			v.setCenter(ol.proj.fromLonLat([position.lon,position.lat]));
		}
	});
}


function poiEvent(){
	// 进行查询
	$(".poi-item").click(function(){
		var name = $(this).find("div").text();
		$(".left_panel").hide();
		$("#result_container_div").show();
		$(".result_container").remove();
		// 清空poi图层上的数据
		var source = poiVector.getSource();
	    source.clear();
		getPoi(name);
	});

	// 返回面板
	$("#return_menu a").click(function(){
		$(".left_panel").hide();
		$("#catalog_div").show();
	});
}


function getPoi(name){
	if(name == null){
		return;
	}
	var url = "http://127.0.0.1/ows/user1/mgr";
	var extent = getMapExtent();
	var extentStr = extent.xmin + "," + extent.ymin + "," + extent.xmax + ","
		+ extent.ymax;
	var params = "service=poi&version=1.0.0&request=GetPoi&name=" 
		+ name + "&limit=20&offset=0&extent=" + extentStr;
		;
	$.ajax({
		type	:"get",
		url		: url,
		data	: encodeURI(params),
		dataType: "xml",
		async	: true,
		beforeSend: function(XMLHttpRequest){
		},
		success	: function(xml, textStatus){
			var pois = prasePois(xml);
			if(pois == null){
				return;
			}
			showPoisResult(pois);
			showPoisInMap(pois);
			// prasePois(xml);
		},
		complete: function(XMLHttpRequest, textStatus){
		},
		error	: function(xml, textStatus){
			processError();
		}
	});
}

// function prasePois(xml){
// 	if(xml == null){
// 		return;
// 	}
// 	var html = "";
// 	$(xml).find("Pois>Poi").each(function(){
// 		var name = $(this).find("name").text();
// 		var lat = $(this).find("lat").text();
// 		var lon = $(this).find("lon").text();
// 		var address = $(this).find("address").text();
// 		var poiHtml = "<div class='result_container'>"
// 			+	"<ul>"
// 			+	"	<li><div class='result_logo'></div></li>"
// 			+	"	<li class='result_div_li'>"
// 			+	"		<div class='result_div'>"
// 			+	"			<div class='result_name'>" + name + "</div>"
// 			+	"			<div class='result_address'>地址:" + address + "</div>"
// 			+	"		</div>"
// 			+	"	</li>"
// 			+	"	<div style='clear:both'></div>"
// 			+	"</ul>"
// 			+	"</div>"; 
// 		html += poiHtml;
// 	});
// 	$("#return_menu").after(html);
// }

// 解析出poi
function prasePois(xml){
	if(xml == null){
		return null;
	}
	var pois = [];
	$(xml).find("Pois>Poi").each(function(){
		
		var name = $(this).find("name").text();
		var lat = $(this).find("lat").text();
		var lon = $(this).find("lon").text();
		var address = $(this).find("address").text();
		var poi = {
			name : name,
			lon : lon,
			lat : lat,
			address : address
		};
		pois.push(poi);
	});
	return pois;
}

// 展示结果列表
function showPoisResult(pois){
	if(pois == null){
		return;
	}
	var poiObj = null;
	var name = null,lat = null,lon = null,address = null;
	var html = "";
	for(var i = 0; i < pois.length;++i){
		poiObj = pois[i];
		name = poiObj.name;
		address = poiObj.address;
		lat = poiObj.lat;
		lon = poiObj.lon;
		var poiHtml = "<div class='result_container'>"
			+	"<ul>"
			+	"	<li><div class='result_logo'></div></li>"
			+	"	<li class='result_div_li'>"
			+	"		<div class='result_div'>"
			+	"			<div class='result_name'>" + name + "</div>"
			+	"			<div class='result_address'>地址:" + address + "</div>"
			+	"		</div>"
			+	"	</li>"
			+	"	<div style='clear:both'></div>"
			+	"</ul>"
			+	"</div>"; 
		html += poiHtml;
	}
	$("#return_menu").after(html);
}


function poiSearchEvent(){
	$("#search_btn").click(function(){
		var name = $("#search_text").val();
		if(name == null || name == ""){
			alert("请输入查询条件");
			return;
		}
		$(".left_panel").hide();
		$("#result_container_div").show();
		$(".result_container").remove();
		// 清空poi图层上的数据
		var source = poiVector.getSource();
	    source.clear();
		getPoi(name);
	});
}

