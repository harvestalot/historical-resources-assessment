 $(function(){
	start_init.init("overview");
	$("#data_origin").html("数据来源："+data_origin.home);
	// 点击主导航
	$("#nav a").click(function(){
		event.stopPropagation();
		point_layer? map.remove(point_layer):"";//清除icon点图层
		heatmapLayer? map.remove(heatmapLayer):"";//清除热力图图层
		reachabilityLayer? map.remove(reachabilityLayer):"";//清除可达性覆盖范围图层
		infoWindow? map.remove(infoWindow):"";//清除信息窗体
		// $("#shade_modal").height() === 0? $("#shade_modal").animate({height:"100%"},300): $("#shade_modal").animate({height:0},300);
		map.setZoomAndCenter(15,[116.425768,39.940966]);
		$("#visualization_content").animate({width:0},300);//移除数据图表层
		$("#shade_modal").slideToggle(300);
		$("#shade_modal .shade_item").show(200);
		if($(this).index() === 0){
			// $("#shade_modal").height() === 0? $("#shade_modal").animate({height:"100%"},300): $("#shade_modal").animate({height:0},300);
			var html = template("introduction_tmp",brief_introduction);
			document.getElementById('shade_modal').innerHTML = html;
		}else if($(this).index() === 1){
			// $("#shade_modal").height() === 0? $("#shade_modal").animate({height:"100%"},300): $("#shade_modal").animate({height:0},300);
			var html = template("introduction_tmp",planning_target);
			document.getElementById('shade_modal').innerHTML = html;
		}else if($(this).index() === 2){
			// $("#shade_modal").height() === 0? $("#shade_modal").animate({height:"100%"},300): $("#shade_modal").animate({height:0},300);
			var html = template("historical_development_tmp",district_history_img_data);
			document.getElementById('shade_modal').innerHTML = html;
			$("#history_tab span").on("click",function(){
				$(this).addClass("active_history_tab").siblings("span").removeClass("active_history_tab");
				var district_history_img_str = "";
				if($(this).attr("data_type") === "1"){
					for(var i = 0; i < district_history_img_data.img_list.length; i++){
						district_history_img_str += '<div><img src='+district_history_img_data.img_list[i]+' alt=""></div>';
					}
				}else if($(this).attr("data_type") === "2"){
					for(var i = 0; i < resource_history_img_data.img_list.length; i++){
						district_history_img_str += '<div><img src='+resource_history_img_data.img_list[i]+' alt=""></div>';
					}
				}
				$("#dynasty_introduction").html(district_history_img_str);
			});
		}
	});
	//点击内容区关闭遮罩
	$("#subNavBox").click(function(){
		event.stopPropagation();
		$("#visualization_content").animate({width:0},300);
		// $("#shade_modal").animate({height:0},300);
	});
    //侧边导航控制器
 	$(".subNav").next(".navContent").length === 0? $(".subNav").css({"background":"none"}):"";
    $(".subNav").click(function(){
    	event.stopPropagation();
		// $("#shade_modal").animate({height:0},300);
		$("#shade_modal").slideUp(300);
		$("#shade_modal .shade_item").hide(200);
        if($(this).next(".navContent").length > 0) {
	        $(this).toggleClass("currentDd").siblings(".subNav").removeClass("currentDd");
	        $(this).toggleClass("currentDt").siblings(".subNav").removeClass("currentDt");
	        $(this).next(".navContent").slideToggle(300).siblings(".navContent").slideUp(500);
        }else{
			$(this).attr("data_type") === "population"?
				$("#visualization_content").animate({width:"30%"},300):
				$("#visualization_content").animate({width:0},300);;
        	$("#visualization_echarts_content").html("");
        	$(this).addClass("subNavCurrent").siblings(".navContent").find("a").removeClass("subNavCurrent");var _this = this;
			setTimeout(function(){
				start_init.init_module($(_this).attr("data_type"));
			}, 500);
        }

	});
    $(".navContent a").click(function(){
    	event.stopPropagation();
		// $("#shade_modal").animate({height:0},300);
		$("#shade_modal").slideUp(300);
		$("#shade_modal .shade_item").hide(200);
		$("#visualization_content").animate({width:"30%"},300);
        $("#visualization_echarts_content").html("");
    	$(this).parents(".subNavBox").find(".subNavCurrent").removeClass("subNavCurrent");
        $(this).addClass("subNavCurrent");
		var _this = this;
		setTimeout(function(){
			start_init.init_module($(_this).attr("data_type"));
		}, 500);
    });

});