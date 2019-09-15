 $(function(){
 	var current_nav = 0;
	start_init.init("overview");
	$("#data_origin").html("数据来源："+data_origin.home);
	// 点击主导航
	$("#nav a").click(function(){
		event.stopPropagation();
		map.setZoomAndCenter(15,[116.425768,39.940966]);
		$("#shade_modal .shade_item").show(200);
		$("#real_time_traffic_explain").hide();//交通实况提示
		$("#industrial_service").hide();
		$("#community_opinion").hide();//隐藏社区舆情搜索框
		$("#year_switcher").hide();
		$("#map_legend").hide();
		$("#data_origin").hide();
		$("#pio_point_list").fadeOut(300);
		$("#visualization_content").animate({width:0},300);
		start_init.reset();
		map.clearMap();
		start_init.default_community_layer();
		$(this).addClass("is_active").siblings("a").removeClass("is_active");
		if($(this).index() === 0){
			$("#shade_modal").slideToggle(300);
			$("#shade_modal_planning").hide();
			$("#shade_modal_historical").hide();
			var html = template("introduction_tmp",brief_introduction);
			document.getElementById('shade_modal').innerHTML = html;
		}else if($(this).index() === 1){
			$("#shade_modal_planning").slideToggle(300);
			$("#shade_modal").hide();
			$("#shade_modal_historical").hide();
			var html = template("introduction_tmp",planning_target);
			document.getElementById('shade_modal_planning').innerHTML = html;
		}else if($(this).index() === 2){
			$("#shade_modal_historical").slideToggle(300);
			$("#shade_modal").hide();
			$("#shade_modal_planning").hide();
			var html = template("historical_development_tmp",district_history_img_data);
			document.getElementById('shade_modal_historical').innerHTML = html;
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
    $(".subNav").unbind("click").click(function(){
    	event.stopPropagation();
		$("#nav a").removeClass("is_active");
		$("#shade_modal").slideUp(300);
		$("#shade_modal_planning").slideUp(300);
		$("#shade_modal_historical").slideUp(300);
		$(".shade_modal .shade_item").hide(200);
        if($(this).next(".navContent").length > 0) {
	        $(this).toggleClass("currentDd").siblings(".subNav").removeClass("currentDd");
	        $(this).toggleClass("currentDt").siblings(".subNav").removeClass("currentDt");
	        $(this).next(".navContent").slideToggle(300).siblings(".navContent").slideUp(500);
        }else{
			$("#visualization_content").animate({width:"30%"},300)
        	$("#visualization_echarts_content").html("");
        	$(this).addClass("subNavCurrent").siblings(".navContent").find("a").removeClass("subNavCurrent");var _this = this;
			setTimeout(function(){
				start_init.init_module($(_this).attr("data_type"));
			}, 500);
        }

	});
    $(".navContent a").unbind("click").click(function(){
    	event.stopPropagation();
		$("#nav a").removeClass("is_active");
		$("#shade_modal").slideUp(300);
		$("#shade_modal_planning").slideUp(300);
		$("#shade_modal_historical").slideUp(300);
		$(".shade_modal .shade_item").hide(200);
		$("#visualization_content").animate({width:"30%"},300);
        $("#visualization_echarts_content").html("");
    	$(this).parents(".subNavBox").find(".subNavCurrent").removeClass("subNavCurrent");
        $(this).addClass("subNavCurrent");
		var _this = this;
		setTimeout(function(){
			start_init.init_module($(_this).attr("data_type"));
		}, 500);
    });
	//记录访问次数
	var caution=false
	function setCookie(name,value,expires,path,domain,secure) 
	{
	 var curCookie=name+"="+escape(value) +
	 ((expires)?";expires="+expires.toGMTString() : "") +
	 ((path)?"; path=" + path : "") +
	 ((domain)? "; domain=" + domain : "") +
	 ((secure)?";secure" : "")
	 if(!caution||(name + "=" + escape(value)).length <= 4000)
	 {
	 document.cookie = curCookie
	 }
	 else if(confirm("Cookie exceeds 4KB and will be cut!"))
	 {
	 document.cookie = curCookie
	 }
	}
	function getCookie(name) 
	{
	 var prefix = name + "="
	 var cookieStartIndex = document.cookie.indexOf(prefix)
	 if (cookieStartIndex == -1)
	 {
	 return null
	 }    
	 var cookieEndIndex=document.cookie.indexOf(";",cookieStartIndex+prefix.length)
	 if(cookieEndIndex == -1)
	 {
	 cookieEndIndex = document.cookie.length
	 }
	 return unescape(document.cookie.substring(cookieStartIndex+prefix.length,cookieEndIndex))
	}
	function deleteCookie(name, path, domain) 
	{
	 if(getCookie(name)) 
	 {
	 document.cookie = name + "=" + 
	 ((path) ? "; path=" + path : "") +
	 ((domain) ? "; domain=" + domain : "") +
	 "; expires=Thu, 01-Jan-70 00:00:01 GMT"
	 }
	}
	function fixDate(date){
	 	var base=new Date(0)
	 	var skew=base.getTime()
	 	if(skew>0){
	 		date.setTime(date.getTime()-skew)
	 	}    
	}
	var now=new Date()
	fixDate(now)
	now.setTime(now.getTime()+365 * 24 * 60 * 60 * 1000)
	var visits = getCookie("counter")
	var IP = getCookie("IP")
	if(!visits){
	 	visits=1;
	}else{
		if(IP === returnCitySN["cip"]){
	 		visits=parseInt(visits);
		}else{
			visits = parseInt(visits)++;
		}
	}
	setCookie("counter", visits, now);
	setCookie("IP", returnCitySN["cip"], now);
	$("#user_access").html("第"+visits+"位用户到访！")
});