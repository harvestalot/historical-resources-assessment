// 公共设施--便民设施
function PublicServiceEducation() {
	this.communityName = [];
	this.seriesData = [];//玫瑰饼状图图表加载的数据
	this.legendData = ['九年一贯制','中学','小学','幼儿园',   ];
	this.radar_chart_indicator_data = [];
	this.pie_comprehensive_data = {
        "幼儿园":[{name:"幼儿园", value: 0},{name:"幼儿园", value: 0},{name:"幼儿园", value: 0},
        	{name:"幼儿园", value: 0},{name:"幼儿园", value: 0},{name:"幼儿园", value: 0},
        	{name:"幼儿园", value: 0},{name:"幼儿园", value: 0},{name:"幼儿园", value: 0},
        	{name:"幼儿园", value: 0},{name:"幼儿园", value: 0},{name:"幼儿园", value: 0}],
        "小学":[{name:"小学", value: 0},{name:"小学", value: 0},{name:"小学", value: 0},
        	{name:"小学", value: 0},{name:"小学", value: 0},{name:"小学", value: 0},
        	{name:"小学", value: 0},{name:"小学", value: 0},{name:"小学", value: 0},
        	{name:"小学", value: 0},{name:"小学", value: 0},{name:"小学", value: 0}],
        "中学":[{name:"中学", value: 0},{name:"中学", value: 0},{name:"中学", value: 0},
        	{name:"中学", value: 0},{name:"中学", value: 0},{name:"中学", value: 0},
        	{name:"中学", value: 0},{name:"中学", value: 0},{name:"中学", value: 0},
        	{name:"中学", value: 0},{name:"中学", value: 0},{name:"中学", value: 0}],
        "九年一贯制":[{name:"九年一贯制", value: 0},{name:"九年一贯制", value: 0},{name:"九年一贯制", value: 0},
        	{name:"九年一贯制", value: 0},{name:"九年一贯制", value: 0},{name:"九年一贯制", value: 0},
        	{name:"九年一贯制", value: 0},{name:"九年一贯制", value: 0},{name:"九年一贯制", value: 0},
        	{name:"九年一贯制", value: 0},{name:"九年一贯制", value: 0},{name:"九年一贯制", value: 0}],
    };
	this.bar_comprehensive_data = {
        "九年一贯制":[0,0,0,0,0,0,0,0,0,0,0,0],
        "中学":[0,0,0,0,0,0,0,0,0,0,0,0],
        "小学":[0,0,0,0,0,0,0,0,0,0,0,0],
        "幼儿园":[0,0,0,0,0,0,0,0,0,0,0,0],
    };
}
PublicServiceEducation.prototype.init = function(){
	this.reset_data();
	this.render_point_layer();
	this.load_dom();
	const _this = this;
	//教育设施请求
	serveRequest("get", server_url+ "/Coverage/getCoverageByCategory",{ category: "education" },function(result){
		_this.get_view_data(result.data.resultKey);
		_this.load_chart("");
		_this.click_dom();
		// _this.load_radar_chart()
		_this.load_bar_chart();//柱状图
	});
}
//分类拆分数据
PublicServiceEducation.prototype.get_view_data = function(result_data){
	for(var i = 0; i < result_data.length; i++){
	    for(var key in result_data[i]){
	        this.communityName.push(key);
	        this.radar_chart_indicator_data.push({
	            name: key,
	            max:1000,
	            color:'#fff'
	        })
	        if(result_data[i][key].length > 0){
	            for(var j = 0; j < result_data[i][key].length; j++){
	                this.pie_comprehensive_data[result_data[i][key][j].CATEGORY_NAME][i].value = result_data[i][key][j].COVERAGE;
	                this.bar_comprehensive_data[result_data[i][key][j].CATEGORY_NAME][i] = result_data[i][key][j].COVERAGE;
	            }
	        }
	    }
	}
}
//添加教育设施点标识图层
PublicServiceEducation.prototype.render_point_layer = function(){
	const _this = this;
	const icon_url_config = {
		"幼儿园": "youeryuan",
		"小学": "xiaoxue",
		"中学": "zhongxue",
		"九年一贯制": "zhongxue",
	};
    point_layer = new Loca.IconLayer({
        map: map,
        eventSupport:true,
	    // zIndex: 100
    });
    point_layer.setData(educational_facilities_point_data, {
        lnglat: 'lnglat'
    });

    point_layer.setOptions({
        source: function(res) {
            var education_type = res.value.properties["¶þ¼¶²Ëµ¥"];
            // 这里需要写上 http 协议，不能忽略
            // var src = 'http://webapi.amap.com/theme/v1.3/markers/n/mid.png';
            var src = point_icon_server_url+ '/beixinqiao/'+icon_url_config[education_type]+'.svg';
            return src;
        },
        style: {
            size: 32
        }
    });
    point_layer.render();
    point_layer.on('click', function (ev) {
        var properties = ev.rawData.properties;
        //渲染信息窗体
        openInfo(properties["Ãû³Æ"], properties["µØÖ·"], ev.lnglat);
		$.get(reachability_url+"?centerpoint="+ev.lnglat.join()+"&time="+15,function(result){
			var reachability_data = [];
			for(var i = 0; i < JSON.parse(result).result.split(";").length; i++){
				var item = JSON.parse(result).result.split(";")[i];
				reachability_data.push([item.split(",")[0],item.split(",")[1]])
			};
			_this.load_reachability_layer(reachability_data);
		});
    });
}
//生产dom元素
PublicServiceEducation.prototype.load_dom = function(){
	//雷达统计图
	const public_service_dom_str = '<div class="chart_view" style="width: 100%; height: 55%;padding-top:10px;box-sizing: border-box;">'+
	'<div id="public_service_type" class="clearfix statistics_type">'+
	'<a href="javascript:void(0)" class="active_checked" data_type="">全部</a>'+
	'<a href="javascript:void(0)" data_type="1">幼儿园</a>'+
	'<a href="javascript:void(0)" data_type="2">小学</a>'+
	'<a href="javascript:void(0)" data_type="3">中学</a>'+
	'<a href="javascript:void(0)" data_type="4">九年一贯制</a>'+
	'</div>'+
	'<div id="public_service_radar_content" style="width: 100%; height: 94%;"></div>'+
	'</div>'+
	'<div id="education_bar_content" class="chart_view" style="width: 100%; height: 45%;"></div>';
	// '<div class="chart_view" style="width: 100%; height: 50%;">'+
	// '<div class="ranking_title">各项设施评估No.1表</div>'+
	// '<div id="public_service_ranking_content" style="height: 100%;"></div>'+
	// '</div>';
	$("#visualization_echarts_content").append(public_service_dom_str);
};
//点击类型触发
PublicServiceEducation.prototype.click_dom = function(){
	var _this = this;
	$("#public_service_type a").click(function(){
		$(this).addClass("active_checked").siblings("a").removeClass("active_checked");
		_this.load_chart($(this).attr("data_type"));
	});
}
// 加载可达性区域范围图层
PublicServiceEducation.prototype.load_reachability_layer = function(reachability_data){
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
//加载图表数据
PublicServiceEducation.prototype.load_chart = function(type){
	const seriesData = [];
	switch (type){
		case "1" :
			seriesData.push({
		        stack: 'a',
		        name:"幼儿园",
		        type: 'pie',
			    center:["50%","54%"],
		        radius: ["0", "80%"],
		        roseType: 'area',
		        label: {
		            normal: {
		                show: false
		            },
		            emphasis: {
		                show: false
		            }
		        },
		        data:this.pie_comprehensive_data["幼儿园"]
			});
			break;
		case "2" :
			seriesData.push({
		        stack: 'a',
		        name:"小学",
		        type: 'pie',
			    center:["50%","54%"],
		        radius: ["0", "80%"],
		        roseType: 'area',
		        label: {
		            normal: {
		                show: false
		            },
		            emphasis: {
		                show: false
		            }
		        },
		        data:this.pie_comprehensive_data["小学"]
			});
			break;
		case "3" :
			seriesData.push({
		        stack: 'a',
		        name:"中学",
		        type: 'pie',
			    center:["50%","54%"],
		        radius: ["0", "80%"],
		        roseType: 'area',
		        label: {
		            normal: {
		                show: false
		            },
		            emphasis: {
		                show: false
		            }
		        },
		        data:this.pie_comprehensive_data["中学"]
			});
			break;
		case "4" :
			seriesData.push({
		        stack: 'a',
		        name:"九年一贯制",
		        type: 'pie',
			    center:["50%","54%"],
		        radius: ["0", "80%"],
		        roseType: 'area',
		        label: {
		            normal: {
		                show: false
		            },
		            emphasis: {
		                show: false
		            }
		        },
		        data:this.pie_comprehensive_data["九年一贯制"]
			});
			break;
		default:
			for(var i = 0; i< this.legendData.length; i++){
				seriesData.push({
			        stack: 'a',
			        type: 'pie',
			        center:["50%","54%"],
			        radius: ["0", "80%"],
			        roseType: 'area',
			        label: {
			            normal: {
			                show: false
			            },
			            emphasis: {
			                show: false
			            }
			        },
			        data:this.pie_comprehensive_data[this.legendData[i]]
				});
			}
	};
	this.load_pie_chart(type,seriesData);
}
//加载极坐标系南丁格尔叠加玫瑰图表数据
PublicServiceEducation.prototype.load_pie_chart = function(type_name, seriesData){
	var radarChart = echarts.init(document.getElementById("public_service_radar_content"));
	var option = {
    	color: type_name === "1"?echarts_color[3]:
				(type_name === "2"?echarts_color[2]:
				(type_name === "3"?echarts_color[1]:
				((type_name === "4"?echarts_color[0]: echarts_color)))),
	    polar: {
	    	center:["50%","54%"]
	    },
	    angleAxis: {
	        type: 'category',
	        nameTextStyle:{
	        	color:"#fff"
	        },
	        axisLabel: {
	            // fontSize: 15,
	            color:'#fff',
		        formatter:function(val){
		            return val.split("").join("\n");
		        }
	        },
	        data: this.communityName,
	    },
	    radiusAxis: {
	        min: 0,
	        max: 1000,
	        interval: 200
	        // axisLine:{
	        // 	show:false,
	        // }
	    },
	    tooltip: {
	        trigger: 'item',
	        formatter: "{a} <br/>{b} : {c} ({d}%)"
	    },
	    legend: {
	        x: 'center',
	        y: 'top',
	        top:10,
	        textStyle:{
	        	color:"#fff",
	        },
	        data: ['幼儿园', '小学', '中学', '九年一贯制']
	    },
	    calculable: true,
	    series: seriesData
	}
    radarChart.setOption(option, true);
}
//加载柱状统计图
PublicServiceEducation.prototype.load_bar_chart = function(){
	const _this = this;
	var myChart = echarts.init(document.getElementById("education_bar_content"));
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
	        axisLabel: {
	        	...coordinate_axis_style.axisLabel,
	        	...{
			        formatter:function(val){
			            return val.split("").join("\n");
			        }
    		}},
	        axisLine: coordinate_axis_style.axisLine,
	        splitLine: coordinate_axis_style.splitLine,
	        data: this.communityName
	    },
	    yAxis: {
	        type: "value",
	        axisLabel: coordinate_axis_style.axisLabel,
	        axisLine: coordinate_axis_style.axisLine,
	        splitLine: coordinate_axis_style.splitLine,
	        name: "人数"
	    },
	    series: [
	    	{
		        "name":  this.legendData[0],
		        "stack": "one",
		        "type": "bar",
	        	barWidth: 15,
		        data:this.pie_comprehensive_data[this.legendData[0]],
			},
	    	{
		        "name":  this.legendData[1],
		        "stack": "one",
		        "type": "bar",
	        	barWidth: 15,
		        data:this.pie_comprehensive_data[this.legendData[1]],
			},
	    	{
		        "name":  this.legendData[2],
		        "stack": "one",
		        "type": "bar",
	        	barWidth: 15,
		        data:this.pie_comprehensive_data[this.legendData[2]],
			},
	    	{
		        "name":  this.legendData[3],
		        "stack": "one",
		        "type": "bar",
	        	barWidth: 15,
		        data:this.pie_comprehensive_data[this.legendData[3]],
			},
	    ]
	};
    myChart.setOption(option, true);
}

// //加载养老设施覆盖率雷达图图表数据
// PublicServiceEducation.prototype.load_radar_chart = function(){
// 	var radarChart = echarts.init(document.getElementById("public_service_radar_content"));
// 	var radar_option = {
// 	    color: ["#00FFFF","#3ba0f3",'#ff9921','#E0F319'],
// 		// title:{
// 		// 	text:"各社区养老设施对比图",
// 		// 	left:'20%',
// 		// 	textStyle:{
// 		// 		color: '#1E78B2',
// 		// 		fontSize: 16
// 		// 	}
// 		// },
// 	    legend: {
// 	        show: true,
// 	        right:"10%",
// 	        bottom:"1%",
// 	        textStyle: {
// 	            "fontSize": 14,
// 	            "color": "#fff"
// 	        },
// 	        "data": this.legendData
// 	    },
// 	    tooltip: {
// 	        show: true,
// 	        trigger: "item"
// 	    },
// 	    radar: {
// 	        center: ["50%", "50%"],
// 	        radius: "70%",
// 	        startAngle: 90,
// 	        splitNumber: 4,
// 	        shape: "circle",
// 	        splitArea: {
// 	            "areaStyle": {
// 	                "color": ["transparent"]
// 	            }
// 	        },
// 	        axisLabel: {
// 	            "show": false,
// 	            "fontSize": 18,
// 	            "color": "#fff",
// 	            "fontStyle": "normal",
// 	            "fontWeight": "normal"
// 	        },
// 	        axisLine: {
// 	            "show": true,
// 	            "lineStyle": {
// 	                "color": "grey"//
// 	            }
// 	        },
// 	        splitLine: {
// 	            "show": true,
// 	            "lineStyle": {
// 	                "color": "grey"//
// 	            }
// 	        },
// 	        indicator: this.radar_chart_indicator_data
// 	    },
// 	    "series": [{
// 	        "name": this.legendData[0],
// 	        "type": "radar",
// 	        "symbol": "circle",
// 	        "symbolSize": 3,
// 	        "areaStyle": {
// 	            "normal": {
// 	                "color": "rgba(0,255,255, 0.4)"
// 	            }
// 	        },
// 	        itemStyle:{
// 	            color:'rgba(0,255,255, 1)',
// 	            borderColor:'rgba(0,255,255, 0.3)',
// 	            borderWidth:5,
// 	        },
// 	        "lineStyle": {
// 	            "normal": {
// 	                "type": "dashed",
// 	                "color": "rgba(0,255,255, 1)",
// 	                "width": 1
// 	            }
// 	        },
// 	        "data": [
// 				this.bar_comprehensive_data[this.legendData[0]]
// 	        ]
// 	    }, {
// 	        "name": this.legendData[1],
// 	        "type": "radar",
// 	        "symbol": "circle",
// 	        "symbolSize": 3,
// 	        "itemStyle": {
// 	            "normal": {
// 	                color:'rgba(59,160,243, 1)',
// 	                "borderColor": "rgba(59,160,243, 0.4)",
// 	                "borderWidth": 5
// 	            }
// 	        },
// 	        "areaStyle": {
// 	            "normal": {
// 	                "color": "rgba(59,160,243, 0.5)"
// 	            }
// 	        },
// 	        "lineStyle": {
// 	            "normal": {
// 	                "color": "rgba(59,160,243, 1)",
// 	                "width": 1,
// 	                "type": "dashed"
// 	            }
// 	        },
// 	        "data": [
// 				this.bar_comprehensive_data[this.legendData[1]]
// 	        ]
// 	    },{
// 	        "name": this.legendData[2],
// 	        "type": "radar",
// 	        "symbol": "circle",
// 	        "symbolSize": 3,
// 	        "itemStyle": {
// 	            "normal": {
// 	                color:'rgba(255,153,33, 1)',
// 	                "borderColor": "rgba(255,153,33, 0.4)",
// 	                "borderWidth": 5
// 	            }
// 	        },
// 	        "areaStyle": {
// 	            "normal": {
// 	                "color": "rgba(255,153,33, 0.5)"
// 	            }
// 	        },
// 	        "lineStyle": {
// 	            "normal": {
// 	                "color": "rgba(255,153,33, 1)",
// 	                "width": 1,
// 	                "type": "dashed"
// 	            }
// 	        },
// 	        "data": [
// 				this.bar_comprehensive_data[this.legendData[2]]
// 	        ]
// 	    },{
// 	        "name": this.legendData[3],
// 	        "type": "radar",
// 	        "symbol": "circle",
// 	        "symbolSize": 3,
// 	        "itemStyle": {
// 	            "normal": {
// 	                color:'rgba(224,243,25, 1)',
// 	                "borderColor": "rgba(224,243,25, 0.4)",
// 	                "borderWidth": 5
// 	            }
// 	        },
// 	        "areaStyle": {
// 	            "normal": {
// 	                "color": "rgba(224,243,25, 0.5)"
// 	            }
// 	        },
// 	        "lineStyle": {
// 	            "normal": {
// 	                "color": "rgba(224,243,25, 1)",
// 	                "width": 1,
// 	                "type": "dashed"
// 	            }
// 	        },
// 	        "data": [
// 				this.bar_comprehensive_data[this.legendData[3]]
// 	        ]
// 	    }]
// 	};
//     radarChart.setOption(radar_option, true);
// }
//加载排行榜统计
PublicServiceEducation.prototype.load_ranking_list = function(data){
	for(var i = 0; i < data.length; i++){
		$("#public_service_ranking_content").append('<p class="ranking_list"><span class="type_name">'
			+data[i].type+'：&nbsp;&nbsp;</span><span class="name_value">'+data[i].name+'（'+data[i].value+'%）</span></p>')
	}
}
//重置数据
PublicServiceEducation.prototype.reset_data = function(){
	this.communityName = [];
	this.seriesData = [];//玫瑰饼状图图表加载的数据
	this.pie_comprehensive_data = {
        "幼儿园":[{name:"幼儿园", value: 0},{name:"幼儿园", value: 0},{name:"幼儿园", value: 0},
        	{name:"幼儿园", value: 0},{name:"幼儿园", value: 0},{name:"幼儿园", value: 0},
        	{name:"幼儿园", value: 0},{name:"幼儿园", value: 0},{name:"幼儿园", value: 0},
        	{name:"幼儿园", value: 0},{name:"幼儿园", value: 0},{name:"幼儿园", value: 0}],
        "小学":[{name:"小学", value: 0},{name:"小学", value: 0},{name:"小学", value: 0},
        	{name:"小学", value: 0},{name:"小学", value: 0},{name:"小学", value: 0},
        	{name:"小学", value: 0},{name:"小学", value: 0},{name:"小学", value: 0},
        	{name:"小学", value: 0},{name:"小学", value: 0},{name:"小学", value: 0}],
        "中学":[{name:"中学", value: 0},{name:"中学", value: 0},{name:"中学", value: 0},
        	{name:"中学", value: 0},{name:"中学", value: 0},{name:"中学", value: 0},
        	{name:"中学", value: 0},{name:"中学", value: 0},{name:"中学", value: 0},
        	{name:"中学", value: 0},{name:"中学", value: 0},{name:"中学", value: 0}],
        "九年一贯制":[{name:"九年一贯制", value: 0},{name:"九年一贯制", value: 0},{name:"九年一贯制", value: 0},
        	{name:"九年一贯制", value: 0},{name:"九年一贯制", value: 0},{name:"九年一贯制", value: 0},
        	{name:"九年一贯制", value: 0},{name:"九年一贯制", value: 0},{name:"九年一贯制", value: 0},
        	{name:"九年一贯制", value: 0},{name:"九年一贯制", value: 0},{name:"九年一贯制", value: 0}],
    };
	this.bar_comprehensive_data = {
        "幼儿园":[0,0,0,0,0,0,0,0,0,0,0,0],
        "小学":[0,0,0,0,0,0,0,0,0,0,0,0],
        "中学":[0,0,0,0,0,0,0,0,0,0,0,0],
        "九年一贯制":[0,0,0,0,0,0,0,0,0,0,0,0],
    }
}
var start_education_rendering = new PublicServiceEducation();