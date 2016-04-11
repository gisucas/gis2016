$().ready(function(){
	cityEvent();
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

