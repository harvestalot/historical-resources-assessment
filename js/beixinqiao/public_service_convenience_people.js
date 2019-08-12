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

}
PublicServiceConveniencePeople.prototype.init = function(){
	this.reset_data();
	this.render_point_layer();
	this.load_dom();
	const _this = this;
	//教育设施请求
	serveRequest("get", server_url+ "/Coverage/getCoverageByCategory",{ category: "convenient"},function(result){
		_this.get_view_data(result.data.resultKey);
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
	            max:4000,
	        })
	        if(result_data[i][key].length > 0){
	            for(var j = 0; j < result_data[i][key].length; j++){
	            	// this.lenged_data.indexOf(result_data[i][key][j].CATEGORY_NAME) === -1? this.lenged_data.push(result_data[i][key][j].CATEGORY_NAME):"";
	                this.comprehensive_data[result_data[i][key][j].CATEGORY_NAME][i] = result_data[i][key][j].COVERAGE;
	            }
	        }
	    }
	}
}
//添加设施点标识图层
PublicServiceConveniencePeople.prototype.render_point_layer = function(){
	var _this = this;
	point_layer = new Loca.IconLayer({
	    map: map,
	    zIndex: 100,
        eventSupport:true,
	});
    point_layer.setData(convenience_people_facilities_point_data, {
        lnglat: 'lnglat'
    });
    point_layer.setOptions({
        source: function(res) {
            var value = res.value;
            var typecode = value.typecode;
            // 这里需要写上 http 协议，不能忽略
            // var src = 'http://webapi.amap.com/theme/v1.3/markers/n/mid.png';
            var src = point_icon_server_url+ '/beixinqiao/bianmin.svg';
            return src;
        },
        style: {
            size: 32
        }
    });
    point_layer.render();
    point_layer.on('click', function (ev) {
    	$("#spectaculars_content p").removeClass("active_checked");
    	// ev.rawData.properties.
		_this.click_dom(ev.lnglat.join(), 15);
    });
}
//生产dom元素
PublicServiceConveniencePeople.prototype.load_dom = function(){
	const public_service_dom_str = '<div class="chart_view" style="width: 100%; height: 60%;">'+
		'<div style="width: 100%; height: 13%;padding-top:20px;box-sizing: border-box;">'+
		'<p style="padding-left:21%;box-sizing: border-box;">街道便民设施覆盖率：<span style="font-size:36px;color:#F7C370;">81%</span></p>'+
		'</div>'+
		'<div id="fraction_coverage_content" style="width: 100%; height: 87%;"></div></div>'+
		'<div id="facilities_statistics_content" class="chart_view" style="width: 100%; height: 40%;">'+
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
	    color: ["#00FFFF","#3ba0f3",'#ff9921', '#E0F319'],
		title:{
			text:"各社区便民设施覆盖率对比图",
			left:'20%',
			textStyle:{
				color: '#1E78B2',
				fontSize: 16
			}
		},
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
	    "series": [{
	        "name": this.lenged_data[0],
	        "type": "radar",
	        "symbol": "circle",
	        "symbolSize": 3,
	        "areaStyle": {
	            "normal": {
	                "color": "rgba(0,255,255, 0.4)"
	            }
	        },
	        itemStyle:{
	            color:'rgba(0,255,255, 1)',
	            borderColor:'rgba(0,255,255, 0.3)',
	            borderWidth:5,
	        },
	        "lineStyle": {
	            "normal": {
	                "type": "dashed",
	                "color": "rgba(0,255,255, 1)",
	                "width": 1
	            }
	        },
	        "data": [
				this.comprehensive_data[this.lenged_data[0]]
	        ]
	    }, {
	        "name": this.lenged_data[1],
	        "type": "radar",
	        "symbol": "circle",
	        "symbolSize": 3,
	        "itemStyle": {
	            "normal": {
	                color:'rgba(59,160,243, 1)',
	                "borderColor": "rgba(59,160,243, 0.4)",
	                "borderWidth": 5
	            }
	        },
	        "areaStyle": {
	            "normal": {
	                "color": "rgba(59,160,243, 0.5)"
	            }
	        },
	        "lineStyle": {
	            "normal": {
	                "color": "rgba(59,160,243, 1)",
	                "width": 1,
	                "type": "dashed"
	            }
	        },
	        "data": [
				this.comprehensive_data[this.lenged_data[1]]
	        ]
	    },{
	        "name": this.lenged_data[2],
	        "type": "radar",
	        "symbol": "circle",
	        "symbolSize": 3,
	        "itemStyle": {
	            "normal": {
	                color:'rgba(255,153,33, 1)',
	                "borderColor": "rgba(255,153,33, 0.4)",
	                "borderWidth": 5
	            }
	        },
	        "areaStyle": {
	            "normal": {
	                "color": "rgba(255,153,33, 0.5)"
	            }
	        },
	        "lineStyle": {
	            "normal": {
	                "color": "rgba(255,153,33, 1)",
	                "width": 1,
	                "type": "dashed"
	            }
	        },
	        "data": [
				this.comprehensive_data[this.lenged_data[2]]
	        ]
	    },{
	        "name": this.lenged_data[3],
	        "type": "radar",
	        "symbol": "circle",
	        "symbolSize": 3,
	        "itemStyle": {
	            "normal": {
	                color:'rgba(224,243,25, 1)',
	                "borderColor": "rgba(224,243,25, 0.4)",
	                "borderWidth": 5
	            }
	        },
	        "areaStyle": {
	            "normal": {
	                "color": "rgba(224,243,25, 0.5)"
	            }
	        },
	        "lineStyle": {
	            "normal": {
	                "color": "rgba(224,243,25, 1)",
	                "width": 1,
	                "type": "dashed"
	            }
	        },
	        "data": [
				this.comprehensive_data[this.lenged_data[3]]
	        ]
	    }]
	};
    radarChart.setOption(radar_option, true);
}
//加载柱状统计图
PublicServiceConveniencePeople.prototype.load_bar_chart = function(){
	const _this = this;
	var myChart = echarts.init(document.getElementById("facilities_statistics_content"));
	var option = {
	    color: ["#00FFFF","#3ba0f3",'#ff9921', '#E0F319'],
	    legend: {
	    	show:false,
	    },
	    tooltip: {
	        "trigger": "axis"
	    },
	    xAxis: {
	        type: "category",
	        axisLabel: {
	        	...coordinate_axis_style.axisLabel,
	        	...{
			        formatter:function(val){
			            return val.split("").join("\n");
			        }
    		}},
	        axisLine: coordinate_axis_style.axisLine,
	        splitLine: coordinate_axis_style.splitLine,
	        data: community_name
	    },
	    yAxis: {
	        type: "value",
	        axisLabel: coordinate_axis_style.axisLabel,
	        axisLine: coordinate_axis_style.axisLine,
	        splitLine: coordinate_axis_style.splitLine,
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
	        },
	        {
	        name: this.lenged_data[3],
	        type: 'bar',
	        stack: 'a',
	        barWidth: 15,
	        data: this.comprehensive_data[this.lenged_data[3]]
	        }
        ]
	};
    myChart.setOption(option, true);
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
}
var start_convenience_people_rendering = new PublicServiceConveniencePeople();