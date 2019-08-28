
	//折线、柱状x、y轴样式配置
	var coordinate_axis_style = {
	    axisLine: {
	        show: true,
	        lineStyle: {
	            color: "#666",
	        }
	    },
	    axisLabel: {
	        show: true,
	        textStyle: {
	            color: "#fff",
	        },
	    },
	    splitLine: {
	        lineStyle: {
	            type: 'dashed',
	            color: '#ddd'
	        }
	    },
	}
	//初始化地图
	var map = new AMap.Map("map", {
	    // mapStyle: 'amap://styles/twilight',
	    // viewMode: '3D',
	    // pitch: 50,
        // 隐藏默认楼块--区域面（bg）/道路（road）/建筑物（building）/标注（point）
        features: ['bg', 'road',"building"],
	    center: [116.425768,39.940966],
	    zoom: 15,
	    zIndex: 10
	    // layers:[],
	});
	//主屏显示
	function VisualScreen(){
		this.current_type = "";
	}
	VisualScreen.prototype.init = function(){
		this.map();
		var _this = this;
		// 交通可达性工具
		$("#traffic_accessibility").on("click",function(){
			window.location.href = './accessibility_map.html';
			// _this.traffic_accessibility();
		});
	}
	//地图
	VisualScreen.prototype.map = function(){
	    load_map("map");
	}
	//根据导航触发加载对应模块数据
	VisualScreen.prototype.init_module = function(current_type){
		$("#real_time_traffic_explain").hide();//交通实况提示
		$("#industrial_service").hide();
		$("#community_opinion").hide();//隐藏社区舆情搜索框
		$("#year_switcher").hide();
		$("#pio_point_list").fadeOut(300);
		this.reset_main_layer();
		this.current_type = current_type;
		this.reset();
		this.default_community_layer();
		map.clearMap();
		// map.setZoomAndCenter(15,[116.433969, 39.94105]);
		switch (this.current_type) {
			case "population": //人口信息
	    		population();
	    		break;
			case "overview": //公共服务设施--概览
				start_overview_rendering.init();
                map_legend(public_service_overview_legend_data); 
	    		break;
			case "convenience": //公共服务设施--便民
				start_convenience_people_rendering.init();
                map_legend(public_service_convenience_people_legend_data); 
	    		break;
			case "education": //公共服务设施--教育
				start_education_rendering.init();
                map_legend(public_service_education_legend_data); 
	    		break;
			case "medical": //公共服务设施--医疗
				start_medical_treatment_rendering.init();
                map_legend(public_service_medical_legend_data); 
	    		break;
			case "recreation_sports": //公共服务设施--文体
				start_recreation_sports_rendering.init();
                map_legend(public_service_sports_legend_data); 
	    		break;
			case "traffic": //公共服务设施--交通
				start_traffic_facilities_rendering.init();
                map_legend(public_service_traffic_legend_data); 
	    		break;
			case "provide": //公共服务设施--养老
				start_provide_rendering.init();
                map_legend(public_service_provide_legend_data); 
	    		break;
			case "street_management": //公共服务设施--街道管理
				start_street_management_rendering.init();
                map_legend(public_service_street_legend_data); 
	    		break;
			case "industry_concentration": //产业结构--产业聚集度
				$("#industrial_service").show();
				this.reset_community_layer();
				start_industry_concentration_rendering.init();
				$("#pio_point_list").fadeIn(300);
	    		break;
			case "industry_development": //产业结构--产业发展
				this.reset_community_layer();
				start_industry_development_rendering.init();
                map_legend(industry_legend_data);
	    		break;
			case "real_time_traffic": //截取活力监测--实时交通路况监测
				$("#real_time_traffic_explain").fadeIn(300);
				this.reset_community_layer();
				start_real_time_traffic_rendering.init();
				$("#visualization_content").animate({width:0},300);
	    		break;
			case "visitors_flow_rate": //截取活力监测--人流量监测
				this.reset_community_layer();
				$("#year_switcher").show();
				start_visitors_flow_rate_rendering.init();
				map.setZoomAndCenter(13,[116.397737, 39.907573]);
				$("#visualization_content").animate({width:0},300);
	    		break;
			case "greenbelt": //公共空间评估--绿地资源
				this.reset_community_layer();
				start_greenbelt_rendering.init();
				// document.getElementById("visualization_content").classList.remove("animated","fadeInRight","fadeOutRight");
	    		break;
			case "public_space": //公共空间评估--公共空间共享
				this.reset_community_layer();
				start_public_space_share_rendering.init();
				// document.getElementById("visualization_content").classList.remove("animated","fadeInRight","fadeOutRight");
	    		break;
			case "available_space": //公共空间评估--可利用空间资源
				this.reset_community_layer();
				start_available_space_rendering.init();
                map_legend(available_space_legend_data);
				// document.getElementById("visualization_content").classList.remove("animated","fadeInRight","fadeOutRight");
	    		break;
			case "culture_overview": //文化资源评估--概览
				start_cultural_resources_overview_rendering.init();
                map_legend(cultural_resources_overview_legend_data);
				// document.getElementById("visualization_content").classList.remove("animated","fadeInRight","fadeOutRight");
	    		break;
			case "material_cultural_heritage": //文化资源评估--物质文化遗产
				// this.reset_community_layer();
				start_material_cultural_heritage_rendering.init();
                map_legend(cultural_heritage_legend_data);
				// document.getElementById("visualization_content").classList.remove("animated","fadeInRight","fadeOutRight");
	    		break;
			case "cultural_relic_protection": //文化资源评估--文物保护单位
				// this.reset_community_layer();
				start_cultural_relic_protection_rendering.init();
				// document.getElementById("visualization_content").classList.remove("animated","fadeInRight","fadeOutRight");
	    		break;
			case "historical_building": //文化资源评估--历史建筑
				// this.reset_community_layer();
				start_historical_building_rendering.init();
                map_legend(historical_building_legend_data);
				// document.getElementById("visualization_content").classList.remove("animated","fadeInRight","fadeOutRight");
	    		break;
			case "community_opinion": //社区舆情
				$("#community_opinion").show();
				this.reset_community_layer();
				start_community_opinion_rendering.init();
	    		break;
        	default:
				this.map();
		}
	}
	//加载交通可达性工具
	VisualScreen.prototype.traffic_accessibility = function(){
		$("#industrial_service").hide();//隐藏产业聚集度搜索框
		$("#community_opinion").hide();//隐藏社区舆情搜索框
		$("#pio_point_list").fadeOut(300);//隐藏产业聚集度PIO列表
		$("#year_switcher").hide();//隐藏让你流量监测热力图年份切换
		$("#visualization_content").animate({width:0},300);
		// document.getElementById("visualization_content").classList.remove("animated","fadeInRight","fadeOutRight");
		map.clearMap();
		this.reset();
		this.reset_community_layer();
		start_traffic_accessibility_rendering.init();
	}
	//重置
	VisualScreen.prototype.reset = function(){
		$("#visualization_echarts_content").html("");
		trafficLayer?map.remove(trafficLayer):"";//清除实时路况图层
		point_layer? map.remove(point_layer):"";//清除icon点图层
		heatmapLayer? map.remove(heatmapLayer):"";//清除热力图图层
		reachabilityLayer? map.remove(reachabilityLayer):"";//清除可达性覆盖范围图层
		infoWindow? map.remove(infoWindow):"";//清除信息窗体
		round_point_layer? map.remove(round_point_layer):"";//清除圆点图层v
		line_layer? map.remove(line_layer):"";//清除线图层
		sidebar_polygonLayer? map.remove(sidebar_polygonLayer):"";//清除区域面图层
		map.setZoomAndCenter(15,[116.425768,39.940966]);
	}
	//重置地图主图层
	VisualScreen.prototype.reset_main_layer = function(){

	    $("#map-features input").each(function(i){
			$(this).val() !== "boundary"? $(this).prop("checked",false):"";
	    })
        // streetCommunityLayer.hide();
        // streetCommunityAreaLayer.hide();
        // layerLabels.hide();
        $("#map_legend").fadeOut(300);
        trafficLayer? trafficLayer.hide():"";
        streetCurrentSituationLandLayer? streetCurrentSituationLandLayer.hide():"",
        streetControlUnitLayer? streetControlUnitLayer.hide():"";
        layerLabels?layerLabels.hide():"";
        streetRoadLandLayer?streetRoadLandLayer.hide():"";
	}
	//重置社区边界、社区区域面、社区名字图层
	VisualScreen.prototype.reset_community_layer = function(){
	    $("#map-features input").each(function(i){
			$(this).val() === "boundary"? $(this).prop("checked",false):"";
	    })
        streetCommunityLayer?streetCommunityLayer.hide():"";
        streetCommunityAreaLayer?streetCommunityAreaLayer.hide():"";
        layerLabels?layerLabels.hide():"";
	}
	//默认选中社区边界、社区区域面、社区名字图层
	VisualScreen.prototype.default_community_layer = function(){
	    $("#map-features input").each(function(i){
			$(this).val() === "boundary"? $(this).prop("checked",true):"";
	    })
        streetCommunityLayer?streetCommunityLayer.show():"";
        streetCommunityAreaLayer?streetCommunityAreaLayer.show():"";
        layerLabels?layerLabels.show():"";
	}
	//初始化
	var	start_init = new VisualScreen();