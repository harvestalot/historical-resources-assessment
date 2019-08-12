// 公共服务设施--概览
function PublicServiceOverview() {
	this.ranking_list = [
		{ type:"便民", name:"北新仓", value: 95 },
		{ type:"教育", name:"海运仓", value: 95 },
		{ type:"医疗", name:"十二条", value: 95 },
		{ type:"文体", name:"青龙", value: 95 },
		{ type:"交通", name:"十三条", value: 95 },
		{ type:"养老", name:"门楼", value: 95 },
		{ type:"街管", name:"北宫厅", value: 95 },
	]
	this.lenged_data = ["社区机构养老设施", "社区助残养老设施"];
	this.community_name = [];
	this.radar_chart_indicator_data = [];
	this.comprehensive_data = {
        "社区机构养老设施":[0,0,0,0,0,0,0,0,0,0,0,0],
        "社区助残养老设施":[0,0,0,0,0,0,0,0,0,0,0,0],
    }
}
PublicServiceOverview.prototype.init = function(){
	this.reset_data();
	this.load_dom();
	const _this = this;
	//教育设施请求
	serveRequest("get", server_url+ "/Coverage/getCoverageByCategory",{ category: "" },function(result){
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
	this.load_chart();
	this.load_ranking_list(this.ranking_list);
	this.click_dom();
}
// PublicServiceOverview.prototype.render_point_layer = function(){
//     point_layer = new Loca.IconLayer({
//         map: map,
// 	    // zIndex: 100
//     });
//     point_layer.setData(educational_facilities_point_data, {
//         lnglat: 'lnglat'
//     });

//     point_layer.setOptions({
//         source: function(res) {
//             var value = res.value;
//             var typecode = value.typecode;
//             // 这里需要写上 http 协议，不能忽略
//             var src = 'http://webapi.amap.com/theme/v1.3/markers/n/mid.png';
//             return src;
//         },
//         style: {
//             size: 15
//         }
//     });
//     point_layer.render();
// }
//生产dom元素
PublicServiceOverview.prototype.load_dom = function(){
	//雷达统计图
	const public_service_dom_str = '<div class="chart_view" style="width: 100%; height: 50%;padding-top:10px;box-sizing: border-box;">'+
	'<div id="public_service_type" class="clearfix statistics_type public_service_type">'+
	'<a href="javascript:void(0)" class="active_checked">全部</a>'+
	'<a href="javascript:void(0)">便民</a>'+
	'<a href="javascript:void(0)">教育</a>'+
	'<a href="javascript:void(0)">医疗</a>'+
	'<a href="javascript:void(0)">养老</a>'+
	'<a href="javascript:void(0)">文体</a>'+
	'<a href="javascript:void(0)">交通</a>'+
	'<a href="javascript:void(0)">街道管理</a>'+
	'</div>'+
	'<div id="public_service_radar_content" style="width: 100%; height: 88%;"></div>'+
	'</div>'+
	'<div class="chart_view" style="width: 100%; height: 50%;">'+
	'<div class="ranking_title">各项设施评估No.1表</div>'+
	'<div id="public_service_ranking_content">'+
	'</div>'+
	'</div>';
	$("#visualization_echarts_content").append(public_service_dom_str);
};
//点击类型触发
PublicServiceOverview.prototype.click_dom = function(){
	var _this = this;
	$("#public_service_type a").click(function(){
		$(this).addClass("active_checked").siblings("a").removeClass("active_checked");
		_this.load_radar_chart($(this).html());
	});
}
//加载图表数据
PublicServiceOverview.prototype.load_chart = function(){
	this.load_radar_chart("全部");
}
//加载雷达图表数据
PublicServiceOverview.prototype.load_radar_chart = function(type_name){

	var radarChart = echarts.init(document.getElementById("public_service_radar_content"));
	var indicator_data = [
		{ name: "北宫厅", max:100 },
		{ name: "北新仓", max:100 },
		{ name: "藏经馆", max:100 },
		{ name: "草园", max:100 },
		{ name: "海运仓", max:100 },
		{ name: "九道湾", max:100 },
		{ name: "门楼", max:100 },
		{ name: "民安", max:100 },
		{ name: "前永康", max:100 },
		{ name: "青龙", max:100 },
		{ name: "十三条", max:100 },
		{ name: "小菊", max:100 },
	];
	var radar_option = {
	    "tooltip": {
	        "show": true,
	        "trigger": "item"
	    },
	    "radar": {
	        "center": ["50%", "50%"],
	        "radius": "70%",
	        "startAngle": 90,
	        "splitNumber": 4,
	        "shape": "circle",
	        "splitArea": {
	            "areaStyle": {
	                "color": ["transparent"]
	            }
	        },
	        "axisLabel": {
	            "show": false,
	            "fontSize": 18,
	            "color": "#fff",
	            "fontStyle": "normal",
	            "fontWeight": "normal"
	        },
	        "axisLine": {
	            "show": true,
	            "lineStyle": {
	                "color": "grey"//
	            }
	        },
	        "splitLine": {
	            "show": true,
	            "lineStyle": {
	                "color": "grey"//
	            }
	        },
	        "indicator": indicator_data
	    },
	    "series": [
	    {
	        "name": type_name,
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
	                "width": 1,
	                "type": "dashed"
	            }
	        },
	        "data": [
	            [60, 60, 65, 60, 70, 40, 80, 63, 68, 60, 77, 60]
	        ]
	    }]
	};
    radarChart.setOption(radar_option, true);
}
//重置数据
PublicServiceOverview.prototype.reset_data = function(){
	this.community_name = [];
	this.radar_chart_indicator_data = [];
	this.comprehensive_data = {
        "社区机构养老设施":[0,0,0,0,0,0,0,0,0,0,0,0],
        "社区助残养老设施":[0,0,0,0,0,0,0,0,0,0,0,0],
    }
}
//加载排行榜统计
PublicServiceOverview.prototype.load_ranking_list = function(data){
	for(var i = 0; i < data.length; i++){
		$("#public_service_ranking_content").append('<p class="ranking_list"><span class="type_name">'
			+data[i].type+'：&nbsp;&nbsp;</span><span class="name_value">'+data[i].name+'（'+data[i].value+'%）</span></p>')
	}
}

var start_overview_rendering = new PublicServiceOverview();