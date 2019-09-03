//公共服务设施--交通设施
function PublicServiceTrafficFacilities() {
	this.lenged_data = ["公交站", "地铁站", "停车场"];
	this.community_name = [];
	this.radar_chart_indicator_data = [];
	this.comprehensive_data = {
        "公交站":[0,0,0,0,0,0,0,0,0,0,0,0],
        "地铁站":[0,0,0,0,0,0,0,0,0,0,0,0],
        "停车场":[0,0,0,0,0,0,0,0,0,0,0,0],
    }
}
PublicServiceTrafficFacilities.prototype.init = function(){
	this.reset_data();
	this.render_point_layer();
	this.load_dom();
	var _this = this;
	//街道管理总覆盖率
	serveRequest("get", server_url+ "/Coverage/getCoverageTotal",{ categoryCode: "transport" },function(result){
		$("#total_coverage").html(JSON.parse(Decrypt(result.data.resultKey))+" %");
	});
	//街道管理请求
	serveRequest("get", server_url+ "/Coverage/getCoverageByCategory",{ category: "transport" },function(result){
		_this.get_view_data(JSON.parse(Decrypt(result.data.resultKey)));
		_this.load_radar_chart();
		_this.load_bar_chart();
	});
}
//分类拆分数据
PublicServiceTrafficFacilities.prototype.get_view_data = function(result_data){
	for(var i = 0; i < result_data.length; i++){
	    for(var key in result_data[i]){
	        this.community_name.push(key);
	        this.radar_chart_indicator_data.push({
	            name: key,
	            max:100,
	            color:'#fff'
	        })
	        if(result_data[i][key].length > 0){
	            for(var j = 0; j < result_data[i][key].length; j++){
	                this.comprehensive_data[result_data[i][key][j].CATEGORY_NAME][i] = result_data[i][key][j].COVERAGE.toFixed(2);
	            }
	        }
	    }
	}
}
//添加设施类型的点标识图层
PublicServiceTrafficFacilities.prototype.render_point_layer = function(){
	var _this = this;
    var round_point_color = echarts_color;
    $.get(file_server_url+'traffic_facilities.js', function (traffic_facilities_point_data) {
	    round_point_layer = new Loca.RoundPointLayer({
	        map: map,
	        zIndex: 100,
	        eventSupport:true,
	    });
	    round_point_layer.setData(JSON.parse(Decrypt(traffic_facilities_point_data)), {
	        lnglat: 'lnglat'
	    });
	    round_point_layer.setOptions({
	        style: {
	            radius: 6,
	            color: function (data) {
	                // console.log(data.value.properties)
	                var type = data.value.properties.facility_type;
	                var color = round_point_color[0];
	                switch (type){
	                    case "公交站" :
	                        color = round_point_color[0];
	                        break;
	                    case "地铁站" :
	                        color = round_point_color[1];
	                        break;
	                    case "停车场" :
	                        color = round_point_color[2];
	                        break;
	                }
	                return color;
	            }
	        }
	    })
	    round_point_layer.render();
	    round_point_layer.on('click', function (ev) {
	    	$("#spectaculars_content p").removeClass("active_checked");
	        var properties = ev.rawData.properties;
	        //渲染信息窗体
	        openInfo(properties.address, properties['¾­ÓªµØ'], ev.lnglat);
			// _this.click_dom(ev.lnglat.join(), 15);
	    });
	})
}
//生产dom元素
PublicServiceTrafficFacilities.prototype.load_dom = function(){
	var public_service_dom_str = '<div class="chart_view" style="width: 100%; height: 60%;">'+
		'<div class="public_service_total_coverage">'+
		'<p >交通设施覆盖率：<span id="total_coverage">0%</span></p>'+
		'</div>'+
		'<div id="fraction_coverage_content" style="width: 100%; height: 87%;"></div></div>'+
		'<div id="facilities_statistics_content" class="chart_view" style="width: 100%; height: 40%;">'+
		'</div>';
	$("#visualization_echarts_content").append(public_service_dom_str);
};
//点击设施点或者看板触发可达性覆盖范围请求
PublicServiceTrafficFacilities.prototype.click_dom = function(centerpoint, time){
	var _this = this;
	$.get(reachability_url+"?centerpoint="+centerpoint+"&time="+time,function(result){
		var reachability_data = [];
		for(var i = 0; i < JSON.parse(result).result.split(";").length; i++){
			var item = JSON.parse(result).result.split(";")[i];
			reachability_data.push([item.split(",")[0],item.split(",")[1]])
		};
		_this.load_reachability_layer(reachability_data);
	});
}
// 加载可达性区域范围图层
PublicServiceTrafficFacilities.prototype.load_reachability_layer = function(reachability_data){
	reachabilityLayer?map.remove(reachabilityLayer):"";
    reachabilityLayer = new Loca.PolygonLayer({
        map: map,
        zIndex: 1,
        fitView: true,
        eventSupport:false,
    });
    reachabilityLayer.setData([{lnglat: reachability_data}], {
        lnglat: 'lnglat'
    });
    reachabilityLayer.setOptions({
        style: {
            color: "#35F8BA",
            height: function () {
                return Math.random() * 500 + 100;
            }
        }
    });
    reachabilityLayer.render();
}
//加载设施覆盖率雷达图图表数据
PublicServiceTrafficFacilities.prototype.load_radar_chart = function(){
	var radarChart = echarts.init(document.getElementById("fraction_coverage_content"));
	var radar_option = {
	    color: echarts_color,
		title:get_object_assign({
			text:"各社区交通设施覆盖率对比图",
		}, echart_title),
	    legend: {
	        show: true,
	        right:"10%",
	        bottom:"1%",
	        textStyle: {
	            "fontSize": 14,
	            "color": "#fff"
	        },
	        "data": this.lenged_data
	    },
	    tooltip: {
	        show: true,
	        trigger: "item"
	    },
	    radar: {
	        center: ["50%", "50%"],
	        radius: "70%",
	        startAngle: 90,
	        splitNumber: 4,
	        shape: "circle",
	        splitArea: {
	            "areaStyle": {
	                "color": ["transparent"]
	            }
	        },
	        axisLabel: {
	            "show": false,
	            "fontSize": 18,
	            "color": "#fff",
	            "fontStyle": "normal",
	            "fontWeight": "normal"
	        },
	        axisLine: {
	            "show": true,
	            "lineStyle": {
	                "color": "grey"//
	            }
	        },
	        splitLine: {
	            "show": true,
	            "lineStyle": {
	                "color": "grey"//
	            }
	        },
	        indicator: this.radar_chart_indicator_data
	    },
	    "series": [
	    	get_object_assign(rader_color[0], {
		        "name": this.lenged_data[0],
		        "data": [
					this.comprehensive_data[this.lenged_data[0]]
		        ]
		    }),
	    	get_object_assign(rader_color[1], {
		        "name": this.lenged_data[1],
		        "data": [
					this.comprehensive_data[this.lenged_data[1]]
		        ]
		    }),
	    	get_object_assign(rader_color[2], {
		        "name": this.lenged_data[2],
		        "data": [
					this.comprehensive_data[this.lenged_data[2]]
		        ]
		    })
		]
	};
    radarChart.setOption(radar_option, true);
	window.onresize = function(){
	    radarChart.resize();
	}
}
//加载柱状统计图
PublicServiceTrafficFacilities.prototype.load_bar_chart = function(){
	var _this = this;
	var myChart = echarts.init(document.getElementById("facilities_statistics_content"));
	var option = {
	    color: echarts_color,
	    legend: {
	    	show:false,
	    },
	    tooltip: {
	        "trigger": "axis"
	    },
	    xAxis: {
	        type: "category",
	        axisLabel: get_object_assign(
	        	coordinate_axis_style.axisLabel,
	        	{
			        formatter:function(val){
			            return val.split("").join("\n");
			        }
    		}),
	        axisLine: coordinate_axis_style.axisLine,
	        splitLine: coordinate_axis_style.splitLine,
	        data: community_name
	    },
	    yAxis: {
	        type: "value",
	        axisLabel: coordinate_axis_style.axisLabel,
	        axisLine: coordinate_axis_style.axisLine,
	        splitLine: coordinate_axis_style.splitLine,
	        name: "数量",
	    },
	    series: [
	        {
	        name: this.lenged_data[0],
	        type: 'bar',
	        stack: 'a',
	        barWidth: 15,
	        data: this.comprehensive_data[this.lenged_data[0]]
	        },
	        {
	        name: this.lenged_data[1],
	        type: 'bar',
	        stack: 'a',
	        barWidth: 15,
	        data: this.comprehensive_data[this.lenged_data[1]]
	        },
	        {
	        name: this.lenged_data[2],
	        type: 'bar',
	        stack: 'a',
	        barWidth: 15,
	        data: this.comprehensive_data[this.lenged_data[2]]
	        }
        ]
	};
    myChart.setOption(option, true);
	window.onresize = function(){
	    myChart.resize();
	}
}
//重置数据
PublicServiceTrafficFacilities.prototype.reset_data = function(){
	this.community_name = [];
	this.radar_chart_indicator_data = [];
	this.comprehensive_data = {
        "公交站":[0,0,0,0,0,0,0,0,0,0,0,0],
        "地铁站":[0,0,0,0,0,0,0,0,0,0,0,0],
        "停车场":[0,0,0,0,0,0,0,0,0,0,0,0],
    }
}
var start_traffic_facilities_rendering = new PublicServiceTrafficFacilities();