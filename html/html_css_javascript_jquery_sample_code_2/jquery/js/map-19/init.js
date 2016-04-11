$().ready(function(){
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
		// 后续的定位操作等等
	});
}

function poiEvent(){
	// 进行查询
	$(".poi-item").click(function(){
		var name = $(this).find("div").text();
		$(".left_panel").hide();
		$("#result_container_div").show();
		$(".result_container").remove();
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
	var params = "service=poi&version=1.0.0&request=GetPoi&name=" + name + "&limit=20&offset=0";
	$.ajax({
		type	:"get",
		url		: url,
		data	: encodeURI(params),
		dataType: "xml",
		async	: true,
		beforeSend: function(XMLHttpRequest){
		},
		success	: function(xml, textStatus){
			prasePois(xml);
		},
		complete: function(XMLHttpRequest, textStatus){
		},
		error	: function(xml, textStatus){
			processError();
		}
	});
}


function prasePois(xml){
	if(xml == null){
		return;
	}
	var html = "";
	$(xml).find("Pois>Poi").each(function(){
		var name = $(this).find("name").text();
		var lat = $(this).find("lat").text();
		var lon = $(this).find("lon").text();
		var address = $(this).find("address").text();
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
	});
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
		getPoi(name);
	});
}

