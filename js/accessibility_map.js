$(function(){
	var reachabilityLayer;//可达性区域图层
	//初始化地图
	var accessibility_map = new AMap.Map("accessibility_map", {
	    // 隐藏默认楼块--区域面（bg）/道路（road）/建筑物（building）/标注（point）
	    features: ['bg', 'road',"building"],
	    center: [116.425768,39.940966],
	    zoom: 12,
	    zIndex: 10
	});
	accessibility_map.on('mapload', function () {
	    accessibility_map.getMap().plugin(['AMap.ControlBar'], function () {
	        var controlBar = new AMap.ControlBar();
	        accessibility_map.getMap().addControl(controlBar);
	    });
	});
        // accessibility_map.setDefaultCursor("url('https://lbs.amap.com/webapi/static/Images//0.png'),pointer");

	function AccessibilityMap(){
		this.centerpoint = "";
		this.reachability_data = [];
		this.time = 10;
		this.facilities_type = [];
		this.area_cultural_resources_point_data = [];//可达性区域内的文化资源点

	}
	AccessibilityMap.prototype.init = function(){
		const _this = this; 
		_this.reset_data();
		//点击地图区域
		accessibility_map.on('click', function(event){
			// console.log(event)
			accessibility_map.clearMap();
			reachabilityLayer? accessibility_map.remove(reachabilityLayer):"";//清除可达性覆盖范围图层
			var marker = new AMap.Marker({
			    position: new AMap.LngLat(event.lnglat.lng, event.lnglat.lat),
			    offset: new AMap.Pixel(0, 0),
			    icon: '//vdata.amap.com/icons/b18/1/2.png', // 添加 Icon 图标 URL
			});
			accessibility_map.add(marker);

    		$("#accessibility_facilities_type input:checked").each(function(i){
    			if($(this).val() !== "10" && $(this).val() !== "15"){
    				_this.facilities_type.push($(this).val());
    			}else{
    				_this.time = $(this).val();
    			}
    		})
			_this.centerpoint = event.lnglat.lng + "," + event.lnglat.lat;
			_this.accessibility_range(_this.centerpoint);
		});
		//重置条件
		$("#react_accessibility").on("click",function(){
    		$("#accessibility_facilities_type input").each(function(i){
    			$(this).prop("checked",false);
    			_this.facilities_type = [];
    		})
		})
		//根据条件确定筛选
		$("#search_accessibility").on("click",function(){
			accessibility_map.clearMap();
			reachabilityLayer? accessibility_map.remove(reachabilityLayer):"";//清除可达性覆盖范围图层
    		$("#accessibility_facilities_type input:checked").each(function(i){
    			if($(this).val() !== "10" && $(this).val() !== "15"){
    				_this.facilities_type.push($(this).val());
    			}else{
    				_this.time = $(this).val();
    			}
    		})
    		if(_this.centerpoint){
				_this.accessibility_range(_this.centerpoint);
    		}else{
    			$("#hint_message").html("请先在地图上选择一点").fadeIn(300);
    			setTimeout(function(){
					$("#hint_message").fadeOut(300);
    			},2000);
    		}
		})
	}
	//获取可达性范围
	AccessibilityMap.prototype.accessibility_range = function(centerpoint){
		const _this = this;
		$.get(reachability_url+"?centerpoint="+centerpoint+"&time="+_this.time,function(result){
			var reachability_data = [];
			for(var i = 0; i < JSON.parse(result).result.split(";").length; i++){
				var item = JSON.parse(result).result.split(";")[i];
				reachability_data.push([item.split(",")[0],item.split(",")[1]])
			};
			_this.reachability_data = reachability_data;
			_this.load_reachability_layer();
			if(_this.facilities_type.length > 0){
				_this.accessibility_POI();
			}
			_this.accessibility_resources();//获取文化资源点
		});
	}
	// 加载可达性区域范围图层
	AccessibilityMap.prototype.load_reachability_layer = function(){
	    reachabilityLayer = new Loca.PolygonLayer({
	        map: accessibility_map,
	        zIndex: 1,
	        fitView: true,
	        eventSupport:false,
	    });
	    reachabilityLayer.setData([{lnglat: this.reachability_data}], {
	        lnglat: 'lnglat'
	    });
	    reachabilityLayer.setOptions({
	        style: {
	            color: "#35F8BA",
	            opacity:0.2,
	            // height: function () {
	            //     return Math.random() * 500 + 100;
	            // }
	        }
	    });
	    reachabilityLayer.render();
	}
	//根据条件筛选类型获取范围内的POI点
	AccessibilityMap.prototype.accessibility_POI = function(){
		var _this = this;
		var placeSearch = new AMap.PlaceSearch({});
	    AMap.service(["AMap.PlaceSearch"], function() {
	        var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
	            pageSize: 50, // 单页显示结果条数
	            pageIndex: 1, // 页码
	            map: accessibility_map, // 展现结果的地图实例
	            autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
	        });
		    var polygon = new AMap.Polygon({
		        path: _this.reachability_data,//设置多边形边界路径
		    });
		    placeSearch.searchInBounds(_this.facilities_type.join("|"), polygon, function (status, result){
				// accessibility_map.clearMap();

			    // result.poiList.pois.forEach(function(marker) {
			    //     new AMap.Marker({
			    //         map: accessibility_map,
			    //         // icon: marker.icon,
			    //         position: [marker.location.lng, marker.location.lat],
			    //         offset: new AMap.Pixel(0, 0)
			    //     });
			    // });
		    	// console.log(result)
		    })
		})
	}
	//如类型选择文化资源，则判断文化资源点是否在可达性范围之内
	AccessibilityMap.prototype.accessibility_resources = function(){
		for(var i = 0; i < cultural_resources_point_data.length; i++){
			var items = cultural_resources_point_data[i];
        	var isPointInRing = AMap.GeometryUtil.isPointInRing(items.lnglat, this.reachability_data);
			isPointInRing? this.area_cultural_resources_point_data.push(items): "";
		}
		this.render_point_layer();
	}
	//渲染可达性区域内的符合条件的点图层
	AccessibilityMap.prototype.render_point_layer = function(){
	    var _this = this;
	    var accessibility_round_point_layer = new Loca.RoundPointLayer({
	        map: accessibility_map,
	        zIndex: 100,
	        eventSupport:true,
	    });
	    accessibility_round_point_layer.setData(this.area_cultural_resources_point_data, {
	        lnglat: 'lnglat'
	    });
	    accessibility_round_point_layer.setOptions({
	        style: {
	            radius: 6,
	            color: function (data) {
	                var type = data.value.type;
	                var color = echarts_color[0];
	                switch (type){
	                    case "文化资源" :
	                        color = echarts_color[0];
	                        break;
	                    case "意向腾退文物地" :
	                        color = echarts_color[4];
	                        break;
	                    case "已收回直管公房" :
	                        color = echarts_color[5];
	                        break;
	                    case "产权不明空地" :
	                        color = echarts_color[3];
	                        break;
	                }
	                return color;
	            }
	        }
	    });
	    // accessibility_round_point_layer.render();
			  //   this.area_cultural_resources_point_data.forEach(function(marker) {
			  //       new AMap.Marker({
			  //           map: accessibility_map,
			  //           // icon: marker.icon,
			  //           position: marker.lnglat,
			  //           offset: new AMap.Pixel(0, 0)
			  //       });
			  //   });
	    // round_point_layer.on('click', function (ev) {
	    //     var properties = ev.rawData;
	    //     //渲染信息窗体
	    //     openInfo(properties.name, "", properties.lnglat);
	    // });
	}
	//重置数据
	AccessibilityMap.prototype.reset_data = function(){
		this.centerpoint = "";
		this.reachability_data = [];
		this.time = 10;
		this.facilities_type = [];
		this.area_cultural_resources_point_data = [];//可达性区域内的文化资源点
	}
	const start_accessibility_poi_rending = new AccessibilityMap(); 
	start_accessibility_poi_rending.init();
});
