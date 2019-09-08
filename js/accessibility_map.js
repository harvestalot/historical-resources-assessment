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
	accessibility_map.plugin(["AMap.ToolBar"], function() {
		accessibility_map.addControl(new AMap.ToolBar({
			position:'RT'
		}));
	});
	if(location.href.indexOf('&guide=1')!==-1){
		accessibility_map.setStatus({scrollWheel:false})
	}
        // accessibility_map.setDefaultCursor("url('https://lbs.amap.com/webapi/static/Images//0.png'),pointer");
	//返回
	$("#beixinqiao_subdistrict_link").on("click",function(){
		window.location.href = './beixinqiao_subdistrict.html';
	});
	function AccessibilityMap(){
		this.centerpoint = "";
		this.cultural_resources = "";//文化资源选中、不选 
		this.reachability_data = [];
		this.time = 10;
		this.facilities_type = [];
		this.area_cultural_resources_point_data = [];//可达性区域内的文化资源点

	}
	AccessibilityMap.prototype.init = function(){
		var _this = this; 
		_this.reset_data();
		//点击地图区域
		accessibility_map.on('click', function(event){
			_this.reset_data();
			_this.centerpoint = event.lnglat.lng + "," + event.lnglat.lat;
			_this.accessibility_initialize();
		});
		//重置条件
		$("#react_accessibility").on("click",function(){
			_this.reset_data();
    		$("#accessibility_facilities_type input").each(function(i){
    			$(this).prop("checked",false);
    			_this.facilities_type = [];
    		})
			$("#accessibility_facilities_type input.default_type").prop("checked",true);
		})
		//根据条件确定筛选
		$("#search_accessibility").on("click",function(){
			_this.reset_data();
    		if(_this.centerpoint){
				_this.accessibility_initialize();
    		}else{
    			$("#hint_message").html("请先在地图上选择一点").fadeIn(300);
    			setTimeout(function(){
					$("#hint_message").fadeOut(300);
    			},2000);
    		}
		})
	}
	//初始化
	AccessibilityMap.prototype.accessibility_initialize = function(){
		var _this = this;
			accessibility_map.clearMap();
			reachabilityLayer? accessibility_map.remove(reachabilityLayer):"";//清除文化资源点图层
			var marker = new AMap.Marker({
			    position: new AMap.LngLat(_this.centerpoint.split(",")[0], _this.centerpoint.split(",")[1]),
			    offset: new AMap.Pixel(0, 0),
			    icon: '//vdata.amap.com/icons/b18/1/2.png', // 添加 Icon 图标 URL
			});
			accessibility_map.add(marker);
    		$("#accessibility_facilities_type input:checked").each(function(i){
    			if($(this).val()){
	    			if($(this).val() !== "10" && $(this).val() !== "15" && $(this).val() !== "文化资源"){
	    				_this.facilities_type.push($(this).val());
	    			}else if($(this).val() === "文化资源"){
	    				_this.cultural_resources = $(this).val();
	    			}else{
	    				_this.time = $(this).val();
	    			}
    			}
    		})
			_this.accessibility_range(_this.centerpoint);
	}
	//获取可达性范围
	AccessibilityMap.prototype.accessibility_range = function(centerpoint){
		var _this = this;
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
			if(_this.cultural_resources){
				_this.accessibility_resources();//获取文化资源点
			}
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
		var _this = this;
    	$.get(file_server_url+'cultural_resources.js', function (cultural_resources_point_data) {
			var data = JSON.parse(Decrypt(cultural_resources_point_data));
			for(var i = 0; i < data.length; i++){
				var items = data[i];
	        	var isPointInRing = AMap.GeometryUtil.isPointInRing(items.lnglat, _this.reachability_data);
				isPointInRing? _this.area_cultural_resources_point_data.push(get_object_assign(items,{
				 icon: point_icon_server_url+ "/accessibility/wenhuaziyaun.png",
				})): "";
			}
			_this.render_point_layer();
		})
	}
	//渲染可达性区域内的符合条件的点图层
	AccessibilityMap.prototype.render_point_layer = function(){
	    var _this = this;
	    _this.area_cultural_resources_point_data.forEach(function(marker) {
	        var marker = new AMap.Marker({
	            map: accessibility_map,
	            icon: marker.icon,
			 	extData:marker,
	            position: marker.lnglat,
	            offset: new AMap.Pixel(-15, -10)
	        });
		    marker.on('click', function (ev) {
		        var properties = ev.target.B.extData;
			    var info = [];
			    info.push('<div class="info_window">'+properties.name+'</div>');
			    // info.push('<div class="info_window">地址：'+address+'</div>');
			    infoWindow = new AMap.InfoWindow({
			        content: info.join(""),  //使用默认信息窗体框样式，显示信息内容
			    });
			    infoWindow.open(accessibility_map, properties.lnglat);
		    });
    	});
	}
	//重置数据
	AccessibilityMap.prototype.reset_data = function(){
		this.cultural_resources = "";//文化资源选中、不选 
		this.reachability_data = [];
		this.facilities_type = [];
		this.area_cultural_resources_point_data = [];//可达性区域内的文化资源点
	}
	var start_accessibility_poi_rending = new AccessibilityMap(); 
	start_accessibility_poi_rending.init();
});
