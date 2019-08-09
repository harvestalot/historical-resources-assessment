//公共服务设施--文体设施
function PublicServiceRecreationSports() {
	this.provide_data = [
		{ name: "民安", A: 85, B: 68 },
		{ name: "民安1", A: 90, B: 88 },
		{ name: "民安2", A: 70, B: 78 },
		{ name: "民安3", A: 35, B: 50 },
		{ name: "民安4", A: 55, B: 28 },
		{ name: "民安5", A: 78, B: 98 },
		{ name: "民安6", A: 30, B: 50 },
		{ name: "民安7", A: 80, B: 40 },
	];
	this.radar_chart_indicator_data = [];

}
PublicServiceRecreationSports.prototype.init = function(){
	this.reset_data();
	this.render_point_layer();
	this.load_dom();
	const _this = this;
	//教育设施请求
	serveRequest("get", server_url+ "/FacilityEducation/getFacilityEducation",{},function(result){
		for(var i = 0; i < _this.provide_data.length; i++){
			var item = _this.provide_data[i];
			_this.radar_chart_indicator_data.push({
				name: item.name,
				max: 100,
			});
		}
		_this.load_radar_chart();
		_this.load_bar_chart();
	});
}
//添加设施点标识图层
PublicServiceRecreationSports.prototype.render_point_layer = function(){
	var _this = this;
	point_layer = new Loca.IconLayer({
	    map: map,
	    zIndex: 100,
        eventSupport:true,
	});
    point_layer.setData(recreation_sports_facilities_point_data, {
        lnglat: 'lnglat'
    });
    point_layer.setOptions({
        source: function(res) {
            var value = res.value;
            var typecode = value.typecode;
            // 这里需要写上 http 协议，不能忽略
            // var src = 'http://webapi.amap.com/theme/v1.3/markers/n/mid.png';
            var src = point_icon_server_url+ '/beixinqiao/wenti.svg';
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
PublicServiceRecreationSports.prototype.load_dom = function(){
	const public_service_dom_str = '<div class="chart_view" style="width: 100%; height: 60%;">'+
		'<div style="width: 100%; height: 13%;padding-top:20px;box-sizing: border-box;">'+
		'<p style="padding-left:21%;box-sizing: border-box;">街道文体设施覆盖率：<span style="font-size:36px;color:#F7C370;">81%</span></p>'+
		'</div>'+
		'<div id="fraction_coverage_content" style="width: 100%; height: 87%;"></div></div>'+
		'<div id="facilities_statistics_content" class="chart_view" style="width: 100%; height: 40%;">'+
		'</div>';
	$("#visualization_echarts_content").append(public_service_dom_str);
};
//点击设施点或者看板触发可达性覆盖范围请求
PublicServiceRecreationSports.prototype.click_dom = function(centerpoint, time){
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
PublicServiceRecreationSports.prototype.load_reachability_layer = function(reachability_data){
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
PublicServiceRecreationSports.prototype.load_radar_chart = function(){
	var radarChart = echarts.init(document.getElementById("fraction_coverage_content"));
	var radar_option = {
		color:["#4748FF", "#D18930"],
		title:{
			text:"各社区文体设施覆盖率对比图",
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
	        "data": ["数据1", "数据2"]
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
	        "name": "数据1",
	        "type": "radar",
	        "symbol": "circle",
	        "symbolSize": 10,
	        "areaStyle": {
	            "normal": {
	                "color": "rgba(245, 166, 35, 0.4)"
	            }
	        },
	        itemStyle:{
	            color:'rgba(245, 166, 35, 1)',
	            borderColor:'rgba(245, 166, 35, 0.3)',
	            borderWidth:10,
	        },
	        "lineStyle": {
	            "normal": {
	                "type": "dashed",
	                "color": "rgba(245, 166, 35, 1)",
	                "width": 2
	            }
	        },
	        "data": [
	            [80, 50, 55, 80, 50, 80, 48, 43, 60, 78, 60, 40, 42, 44, 65]
	        ]
	    }, {
	        "name": "数据2",
	        "type": "radar",
	        "symbol": "circle",
	        "symbolSize": 10,
	        "itemStyle": {
	            "normal": {
	                color:'rgba(19, 173, 255, 1)',
	                "borderColor": "rgba(19, 173, 255, 0.4)",
	                "borderWidth": 10
	            }
	        },
	        "areaStyle": {
	            "normal": {
	                "color": "rgba(19, 173, 255, 0.5)"
	            }
	        },
	        "lineStyle": {
	            "normal": {
	                "color": "rgba(19, 173, 255, 1)",
	                "width": 2,
	                "type": "dashed"
	            }
	        },
	        "data": [
	            [60, 60, 65, 60, 70, 40, 80, 63, 68, 60, 77, 60, 80, 62, 80]
	        ]
	    }]
	};
    radarChart.setOption(radar_option, true);
}
//加载柱状统计图
PublicServiceRecreationSports.prototype.load_bar_chart = function(){
	const _this = this;
	var myChart = echarts.init(document.getElementById("facilities_statistics_content"));
	var option = {
	    color: ["#00FFFF","#3ba0f3",'#ff9921','#f36119'],
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
	        name: '菜站',
	        type: 'bar',
	        stack: 'a',
	        barWidth: 15,
	        data: ['200', '300', '300', '200', '200', '300', '180','300', '200','200', '300', '300']
	        },
	        {
	        name: '超市',
	        type: 'bar',
	        stack: 'a',
	        barWidth: 15,
	        data: ['300', '400', '300', '200', '300', '300', '280','300', '200','200', '300', '300',]
	        },
	        {
	        name: '综合服务站',
	        type: 'bar',
	        stack: 'a',
	        barWidth: 15,
	        data: ['300', '200', '300', '200', '200', '300', '260','300', '200','200', '300', '300',]
	        },
	        {
	        name: '便利店',
	        type: 'bar',
	        stack: 'a',
	        barWidth: 15,
	        data: ['400', '460', '420', '430', '420', '460', '520','300', '200','200', '300', '300',]
	        }
        ]
	};
    myChart.setOption(option, true);
}
//重置数据
PublicServiceRecreationSports.prototype.reset_data = function(){
	this.radar_chart_indicator_data = [];
}
var start_recreation_sports_rendering = new PublicServiceRecreationSports();