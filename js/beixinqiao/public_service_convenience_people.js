//公共服务设施--便民设施
function PublicServiceConveniencePeople() {
	this.lenged_data = ["超市", "便利店", "菜站", "综合服务站"];
	this.community_name = [];
	this.radar_chart_indicator_data = [];
	this.comprehensive_data = {
        "超市":[0,0,0,0,0,0,0,0,0,0,0,0],
        "便利店":[0,0,0,0,0,0,0,0,0,0,0,0],
        "菜站":[0,0,0,0,0,0,0,0,0,0,0,0],
        "综合服务站":[0,0,0,0,0,0,0,0,0,0,0,0],
    }
	this.number_data = {
        "超市":[0,0,0,0,0,0,0,0,0,0,0,0],
        "便利店":[0,0,0,0,0,0,0,0,0,0,0,0],
        "菜站":[0,0,0,0,0,0,0,0,0,0,0,0],
        "综合服务站":[0,0,0,0,0,0,0,0,0,0,0,0],
    }

}
PublicServiceConveniencePeople.prototype.init = function(){
	this.reset_data();
	this.render_point_layer();
	this.load_dom();
	var _this = this;
	//便民设施总覆盖率
	serveRequest("get", server_url+ "/Coverage/getCoverageTotal",{ categoryCode: "convenient" },function(result){
		$("#total_coverage").html(JSON.parse(Decrypt(result.data.resultKey))+" %");
	});
	//便民设施请求
	serveRequest("get", server_url+ "/Coverage/getCoverageByCategory",{ category: "convenient"},function(result){
		_this.get_view_data(JSON.parse(Decrypt(result.data.resultKey)));
		_this.load_radar_chart();
		_this.load_bar_chart();
	});
}
//分类拆分数据
PublicServiceConveniencePeople.prototype.get_view_data = function(result_data){
	for(var i = 0; i < result_data.length; i++){
	    for(var key in result_data[i]){
	        this.community_name.push(key);
	        this.radar_chart_indicator_data.push({
	            name: key,
	            max:100,
	            color:"#fff"
	        })
	        if(result_data[i][key].length > 0){
	            for(var j = 0; j < result_data[i][key].length; j++){
	            	// this.lenged_data.indexOf(result_data[i][key][j].CATEGORY_NAME) === -1? this.lenged_data.push(result_data[i][key][j].CATEGORY_NAME):"";
	                this.comprehensive_data[result_data[i][key][j].CATEGORY_NAME][i] = result_data[i][key][j].COVERAGE.toFixed(2);
	                this.number_data[result_data[i][key][j].CATEGORY_NAME][i] = result_data[i][key][j].QUANTITY;
	            }
	        }
	    }
	}
}
//添加设施类型的点标识图层
PublicServiceConveniencePeople.prototype.render_point_layer = function(){
	var _this = this;
    $.get(file_server_url+'convenience_people_facilities.js', function (convenience_people_facilities_point_data) {
	    var round_point_color = echarts_color;
	    round_point_layer = new Loca.RoundPointLayer({
	        map: map,
	        zIndex: 100,
	        eventSupport:true,
	    });
	    round_point_layer.setData(JSON.parse(Decrypt(convenience_people_facilities_point_data)), {
	        lnglat: 'lnglat'
	    });
	    round_point_layer.setOptions({
	        style: {
	            radius: 6,
	            color: function (data) {
	                // console.log(data.value.properties)
	                var type = data.value.properties["¶þ¼¶²Ëµ¥"];
	                var color = round_point_color[0];
	                switch (type){
	                    case "超市" :
	                        color = round_point_color[0];
	                        break;
	                    case "便利店" :
	                        color = round_point_color[1];
	                        break;
	                    case "菜站" :
	                        color = round_point_color[2];
	                        break;
	                    case "综合服务站" :
	                        color = round_point_color[3];
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
	        openInfo(properties.name, properties['¾­ÓªµØ'], ev.lnglat);
			// _this.click_dom(ev.lnglat.join(), 15);
	    });
	})
}
//生产dom元素
PublicServiceConveniencePeople.prototype.load_dom = function(){
	var public_service_dom_str = '<div class="chart_view" style="width: 100%; height: 65%;">'+
		'<div class="public_service_total_coverage">'+
		'<p >街道便民设施覆盖率：<span id="total_coverage" >0%</span></p>'+
		'</div>'+
		'<div id="fraction_coverage_content" style="width: 100%; height: 87%;"></div></div>'+
		'<div id="facilities_statistics_content" class="chart_view" style="width: 100%; height: 35%;">'+
		'</div>';
	$("#visualization_echarts_content").append(public_service_dom_str);
};
//点击设施点或者看板触发可达性覆盖范围请求
PublicServiceConveniencePeople.prototype.click_dom = function(centerpoint, time){
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
PublicServiceConveniencePeople.prototype.load_reachability_layer = function(reachability_data){
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
PublicServiceConveniencePeople.prototype.load_radar_chart = function(){
	var radarChart = echarts.init(document.getElementById("fraction_coverage_content"));
	var radar_option = {
		// color:["#4748FF", "#D18930"],
	    color: echarts_color,
		title:get_object_assign({
			text:"各社区便民设施覆盖率对比图",
		},echart_title),
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
	        radius: "60%",
	        startAngle: 90,
	        splitNumber: 4,
	        shape: "circle",
	        splitArea: {
	            "areaStyle": {
	                "color": ["transparent"]
	            }
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
	    	get_object_assign(rader_color[0],{
		        "name": this.lenged_data[0],
		        "data": [
					this.comprehensive_data[this.lenged_data[0]]
		        ]
		    }),
	    	get_object_assign(rader_color[1],{
		        "name": this.lenged_data[1],
		        "data": [
					this.comprehensive_data[this.lenged_data[1]]
		        ]
		    }),
	    	get_object_assign(rader_color[2],{
		        "name": this.lenged_data[2],
		        "data": [
					this.comprehensive_data[this.lenged_data[2]]
		        ]
		    }),
	    	get_object_assign(rader_color[3],{
		        "name": this.lenged_data[3],
		        "data": [
					this.comprehensive_data[this.lenged_data[3]]
		        ]
		    }),
		]
	};
    radarChart.setOption(radar_option, true);
	window.onresize = function(){
	    radarChart.resize();
	}
}
//加载柱状统计图
PublicServiceConveniencePeople.prototype.load_bar_chart = function(){
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
	        axisLabel:get_object_assign(coordinate_axis_style.axisLabel,{
		        formatter:function(val){
		            return val.split("").join("\n");
		        }
    		}),
	        axisLine: coordinate_axis_style.axisLine,
	        splitLine: coordinate_axis_style.splitLine,
	        data: this.community_name
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
	        data: this.number_data[this.lenged_data[0]]
	        },
	        {
	        name: this.lenged_data[1],
	        type: 'bar',
	        stack: 'a',
	        barWidth: 15,
	        data: this.number_data[this.lenged_data[1]]
	        },
	        {
	        name: this.lenged_data[2],
	        type: 'bar',
	        stack: 'a',
	        barWidth: 15,
	        data: this.number_data[this.lenged_data[2]]
	        },
	        {
	        name: this.lenged_data[3],
	        type: 'bar',
	        stack: 'a',
	        barWidth: 15,
	        data: this.number_data[this.lenged_data[3]]
	        }
        ]
	};
    myChart.setOption(option, true);
	window.onresize = function(){
	    myChart.resize();
	}
}
//重置数据
PublicServiceConveniencePeople.prototype.reset_data = function(){
	this.community_name = [];
	this.radar_chart_indicator_data = [];
	this.comprehensive_data = {
        "超市":[0,0,0,0,0,0,0,0,0,0,0,0],
        "便利店":[0,0,0,0,0,0,0,0,0,0,0,0],
        "菜站":[0,0,0,0,0,0,0,0,0,0,0,0],
        "综合服务站":[0,0,0,0,0,0,0,0,0,0,0,0],
    }
	this.number_data = {
        "超市":[0,0,0,0,0,0,0,0,0,0,0,0],
        "便利店":[0,0,0,0,0,0,0,0,0,0,0,0],
        "菜站":[0,0,0,0,0,0,0,0,0,0,0,0],
        "综合服务站":[0,0,0,0,0,0,0,0,0,0,0,0],
    }
}
var start_convenience_people_rendering = new PublicServiceConveniencePeople();