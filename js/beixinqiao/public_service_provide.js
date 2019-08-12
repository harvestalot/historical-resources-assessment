//公共服务设施--养老设置
function PublicServiceProvide() {
	// this.provide_data = [
	// 	{ name: "民安", A: 85, B: 68 },
	// 	{ name: "民安1", A: 90, B: 88 },
	// 	{ name: "民安2", A: 70, B: 78 },
	// 	{ name: "民安3", A: 35, B: 50 },
	// 	{ name: "民安4", A: 55, B: 28 },
	// 	{ name: "民安5", A: 78, B: 98 },
	// 	{ name: "民安6", A: 30, B: 50 },
	// 	{ name: "民安7", A: 80, B: 40 },
	// ];
	// this.radar_chart_indicator_data = [];
	this.lenged_data = ["社区机构养老设施", "社区助残养老设施"];
	this.community_name = [];
	this.radar_chart_indicator_data = [];
	this.comprehensive_data = {
        "社区机构养老设施":[0,0,0,0,0,0,0,0,0,0,0,0],
        "社区助残养老设施":[0,0,0,0,0,0,0,0,0,0,0,0],
    }

}
PublicServiceProvide.prototype.init = function(){
	this.reset_data();
	this.render_point_layer();
	this.load_dom();
	const _this = this;
	//教育设施请求
	serveRequest("get", server_url+ "/Coverage/getCoverageByCategory",{ category: "pension",},function(result){
		_this.get_view_data(result.data.resultKey);
		// for(var i = 0; i < _this.provide_data.length; i++){
		// 	var item = _this.provide_data[i];
		// 	_this.radar_chart_indicator_data.push({
		// 		name: item.name,
		// 		max: 100,
		// 	});
		// }
		_this.load_radar_chart();
	});
	$("#spectaculars_content p").click(function(){
		$(this).addClass("active_checked").siblings("p").removeClass("active_checked");
		_this.click_dom("116.42437454,39.93425622", 15);
	});
}
//分类拆分数据
PublicServiceProvide.prototype.get_view_data = function(result_data){
	for(var i = 0; i < result_data.length; i++){
	    for(var key in result_data[i]){
	        this.community_name.push(key);
	        this.radar_chart_indicator_data.push({
	            name: key,
	            max:1000,
	        })
	        if(result_data[i][key].length > 0){
	            for(var j = 0; j < result_data[i][key].length; j++){
	                this.comprehensive_data[result_data[i][key][j].CATEGORY_NAME][i] = result_data[i][key][j].COVERAGE;
	            }
	        }
	    }
	}
}
//添加养老设施点标识图层
PublicServiceProvide.prototype.render_point_layer = function(){
	var _this = this;
	point_layer = new Loca.IconLayer({
	    map: map,
	    zIndex: 100,
        eventSupport:true,
	});
    point_layer.setData(endowment_facilities_point_data, {
        lnglat: 'lnglat'
    });
    point_layer.setOptions({
        source: function(res) {
            var value = res.value;
            var typecode = value.typecode;
            // 这里需要写上 http 协议，不能忽略
            // var src = 'http://webapi.amap.com/theme/v1.3/markers/n/mid.png';
            var src = point_icon_server_url+ '/beixinqiao/yanglao.svg';
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
PublicServiceProvide.prototype.load_dom = function(){
	const public_service_dom_str = '<div class="chart_view" style="width: 100%; height: 60%;">'+
		'<div style="width: 100%; height: 13%;padding-top:20px;box-sizing: border-box;">'+
		'<p style="padding-left:21%;box-sizing: border-box;">街道养老设施覆盖率：<span style="font-size:36px;color:#F7C370;">81%</span></p>'+
		'</div>'+
		'<div id="fraction_coverage_content" style="width: 100%; height: 87%;"></div></div>'+
		'<div class="chart_view" style="width: 100%; height: 40%;">'+
		'<p style="padding:10px 0 10px 21%;font-size:16px;color:#1E78B2;font-weight:700;">养老设施看板</p>'+
		'<div id="spectaculars_content" class="chart_view spectaculars_content" style="width: 100%; height: 40%;">'+
		'<p><span>炮局胡同养老驿站</span><span>海运仓</span><span>50%</span></p>'+
		'<p><span>海运仓社区养老服务驿站</span><span>民安</span><span>87%</span></p>'+
		'</div>'+
		'</div>';
	$("#visualization_echarts_content").append(public_service_dom_str);
};
//点击养老设施点或者看板触发可达性覆盖范围请求
PublicServiceProvide.prototype.click_dom = function(centerpoint, time){
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
PublicServiceProvide.prototype.load_reachability_layer = function(reachability_data){
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
//加载养老设施覆盖率雷达图图表数据
PublicServiceProvide.prototype.load_radar_chart = function(){
	var radarChart = echarts.init(document.getElementById("fraction_coverage_content"));
	var radar_option = {
		color:["#4748FF", "#D18930"],
		title:{
			text:"各社区养老设施对比图",
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
	                "color": "rgba(245, 166, 35, 0.4)"
	            }
	        },
	        itemStyle:{
	            color:'rgba(245, 166, 35, 1)',
	            borderColor:'rgba(245, 166, 35, 0.3)',
	            borderWidth:5,
	        },
	        "lineStyle": {
	            "normal": {
	                "type": "dashed",
	                "color": "rgba(245, 166, 35, 1)",
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
	                color:'rgba(19, 173, 255, 1)',
	                "borderColor": "rgba(19, 173, 255, 0.4)",
	                "borderWidth": 5
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
	            this.comprehensive_data[this.lenged_data[1]]
	        ]
	    }]
	};
    radarChart.setOption(radar_option, true);
}
//重置数据
PublicServiceProvide.prototype.reset_data = function(){
	this.radar_chart_indicator_data = [];
}
var start_provide_rendering = new PublicServiceProvide();