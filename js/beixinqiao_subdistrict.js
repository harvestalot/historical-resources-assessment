 $(function(){
 	// $("#shade_modal .shade_item").css('display',"none");
	start_init.init("overview");
	// 点击主导航
	$("#nav a").click(function(){
		point_layer? map.remove(point_layer):"";//清除icon点图层
		heatmapLayer? map.remove(heatmapLayer):"";//清除热力图图层
		reachabilityLayer? map.remove(reachabilityLayer):"";//清除可达性覆盖范围图层
		infoWindow? map.remove(infoWindow):"";//清除信息窗体
		map.setZoomAndCenter(15,[116.425768,39.940966]);
		document.getElementById("visualization_content").classList.remove("animated","fadeInRight");//移除数据图表层
		document.getElementById("shade_modal").classList.remove("animated","fadeInLeft","zoomOut","fadeInDown","bounceInRight");//移除所有动画
		$("#shade_modal .shade_item").css('display',"none");
		if($(this).index() === 0){
			// $("#brief_introduction").show();
			var html = template("introduction_tmp",brief_introduction);
			document.getElementById('shade_modal').innerHTML = html;
			document.getElementById("shade_modal").classList.add("animated","fadeInLeft");
		}else if($(this).index() === 1){
			// $("#planning_goal").show();
			var html = template("introduction_tmp",brief_introduction);
			document.getElementById('shade_modal').innerHTML = html;
			document.getElementById("shade_modal").classList.add("animated", "fadeInDown");
		}else if($(this).index() === 2){
			// $("#historical_development").show();
			var html = template("historical_development_tmp",district_history_img_data);
			document.getElementById('shade_modal').innerHTML = html;
			document.getElementById("shade_modal").classList.add("animated","bounceInRight");
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
		document.getElementById("shade_modal").classList.remove("animated","fadeInLeft","fadeInDown","bounceInRight");
	});
    //侧边导航控制器
 	$(".subNav").next(".navContent").length === 0? $(".subNav").css({"background":"none"}):"";
    $(".subNav").click(function(){
        if($(this).next(".navContent").length > 0) {
	        $(this).toggleClass("currentDd").siblings(".subNav").removeClass("currentDd");
	        $(this).toggleClass("currentDt").siblings(".subNav").removeClass("currentDt");
	        $(this).next(".navContent").slideToggle(300).siblings(".navContent").slideUp(500);
        }else{
        	$("#visualization_echarts_content").html("");
        	$(this).addClass("subNavCurrent").siblings(".navContent").find("a").removeClass("subNavCurrent");
			start_init.init_module($(this).attr("data_type"));
			document.getElementById("visualization_content").classList.remove("animated","fadeInRight","fadeOutRight");
			document.getElementById("visualization_content").classList.add("animated","fadeInRight");
        }

	});
    $(".navContent a").click(function(){
        $("#visualization_echarts_content").html("");
    	$(this).parents(".subNavBox").find(".subNavCurrent").removeClass("subNavCurrent");
        $(this).addClass("subNavCurrent");
		document.getElementById("visualization_content").classList.remove("animated","fadeInRight","fadeOutRight");
		document.getElementById("visualization_content").classList.add("animated","fadeInRight");
		start_init.init_module($(this).attr("data_type"));
    });
});