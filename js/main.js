
	//折线、柱状x、y轴样式配置
	const coordinate_axis_style = {
	    axisLine: {
	        show: true,
	        lineStyle: {
	            color: "#666",
	        }
	    },
	    axisLabel: {
	        show: true,
	        textStyle: {
	            color: "#999",
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
	}
	//地图
	VisualScreen.prototype.map = function(){
	    load_map("map");
	}
	//根据导航触发加载对应模块数据
	VisualScreen.prototype.init_module = function(current_type){
		this.current_type = current_type;
		this.reset();
		switch (this.current_type) {
			case "population": //人口信息
	    		population();
	    		break;
			case "overview": //公共服务设施--概览
				start_overview_rendering.init(); 
	    		break;
			case "convenience": //公共服务设施--便民
				start_convenience_people_rendering.init();
	    		break;
			case "education": //公共服务设施--教育
				start_education_rendering.init();
	    		break;
			case "medical": //公共服务设施--医疗
				start_medical_treatment_rendering.init();
	    		break;
			case "recreation_sports": //公共服务设施--文体
				start_recreation_sports_rendering.init();
	    		break;
			case "traffic": //公共服务设施--交通
				start_traffic_facilities_rendering.init();
	    		break;
			case "provide": //公共服务设施--养老
				start_provide_rendering.init();
	    		break;
			case "street_management": //公共服务设施--街道管理
				start_street_management_rendering.init();
	    		break;
			case "industry_concentration": //产业结构--产业聚集度
				start_industry_concentration_rendering.init();
	    		break;
			case "industry_development": //产业结构--产业发展
				start_industry_development_rendering.init();
	    		break;
			case "visitors_flow_rate": //截取活力监测--人流量监测
				start_visitors_flow_rate_rendering.init();
				map.setZoomAndCenter(13,[116.397737, 39.907573]);
	    		break;
			case "greenbelt": //公共空间评估--绿地资源
				start_greenbelt_rendering.init();
	    		break;
			case "public_space": //公共空间评估--公共空间共享
				start_visitors_flow_rate_rendering.init();
	    		break;
			case "available_space": //公共空间评估--可利用空间资源
				start_visitors_flow_rate_rendering.init();
	    		break;
        	default:
				this.map();
		}
	}
	//重置
	VisualScreen.prototype.reset = function(){
		$("#visualization_echarts_content").html("");
		point_layer? map.remove(point_layer):"";//清除icon点图层
		heatmapLayer? map.remove(heatmapLayer):"";//清除热力图图层
		reachabilityLayer? map.remove(reachabilityLayer):"";//清除可达性覆盖范围图层
		infoWindow? map.remove(infoWindow):"";//清除信息窗体
		map.setZoomAndCenter(15,[116.425768,39.940966]);
	}
	//初始化
	var	start_init = new VisualScreen();