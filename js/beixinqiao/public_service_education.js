// 公共设施--便民设施
function PublicServiceEducation() {
	this.communityName = [];
	this.seriesData = [];//玫瑰饼状图图表加载的数据
	this.barSeriesData = [];//柱状图渲染数据
	this.kindergartenSeriesData = [];//幼儿园
	this.primarySchoolSeriesData = [];//小学
	this.middleSchoolSeriesData = [];//中学
	this.nineyearSystemSeriesData = [];//九年一贯制
	this.legendData = ['幼儿园', '小学', '中学', '九年一贯制'];
	// this.ranking_list = [
	// 	{ type:"幼儿园", name:"北新仓", value: 95 },
	// 	{ type:"小学", name:"海运仓", value: 95 },
	// 	{ type:"中学", name:"十二条", value: 95 },
	// 	{ type:"九年一贯制", name:"青龙", value: 95 },
	// ];
}
PublicServiceEducation.prototype.init = function(){
	this.reset_data();
	this.render_point_layer();
	this.load_dom();
	const _this = this;
	const barSeriesData_1 = [], barSeriesData_2 = [], barSeriesData_3 = [], barSeriesData_4 = [];
	//教育设施请求
	serveRequest("get", server_url+ "/FacilityEducation/getFacilityEducation",{},function(result){
		for(var i = 0; i < result.data.resultKey.length; i++){
			var items = result.data.resultKey[i];
			if(items.CATEGORY === 1){//幼儿园
				_this.communityName.push(items.COMMUNITY_NAME);
				_this.kindergartenSeriesData.push({
					name: "幼儿园",
					value: items.COVERAGE
				});
				barSeriesData_1.push(items.COVERAGE);
			}else if(items.CATEGORY === 2){//小学
				_this.primarySchoolSeriesData.push({
					name: "小学",
					value: items.COVERAGE
				});
				barSeriesData_2.push(items.COVERAGE);
			}else if(items.CATEGORY === 3){//中学
				_this.middleSchoolSeriesData.push({
					name: "中学",
					value: items.COVERAGE
				});
				barSeriesData_3.push(items.COVERAGE);
			}else if(items.CATEGORY === 4){//九年一贯制
				_this.nineyearSystemSeriesData.push({
					name: "九年一贯制",
					value: items.COVERAGE
				});
				barSeriesData_4.push(items.COVERAGE);
			}
		}
		for(var i = 0; i < _this.legendData.length; i++){
			if(i === 0){
				_this.barSeriesData.push({
			        "name":  _this.legendData[i],
			        "stack": "one",
			        "type": "bar",
			        data:barSeriesData_1,
				});
			}else if(i === 1){
				_this.barSeriesData.push({
			        "name":  _this.legendData[i],
			        "stack": "one",
			        "type": "bar",
			        data:barSeriesData_2,
				});
			}else if(i === 2){
				_this.barSeriesData.push({
			        "name":  _this.legendData[i],
			        "stack": "one",
			        "type": "bar",
			        data:barSeriesData_3,
				});
			}else if(i === 3){
				_this.barSeriesData.push({
			        "name":  _this.legendData[i],
			        "stack": "one",
			        "type": "bar",
			        data:barSeriesData_4,
				});
			}
		}
		_this.load_chart("");
		_this.click_dom();
		_this.load_bar_chart();//柱状图
	});
	// this.load_ranking_list(this.ranking_list);
}
//添加教育设施点标识图层
PublicServiceEducation.prototype.render_point_layer = function(){
	const icon_url_config = {
		"幼儿园": "youeryuan",
		"小学": "xiaoxue",
		"中学": "zhongxue",
		"九年一贯制": "zhongxue",
	};
    point_layer = new Loca.IconLayer({
        map: map,
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
		        data:this.kindergartenSeriesData
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
		        data:this.primarySchoolSeriesData
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
		        data:this.middleSchoolSeriesData
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
		        data:this.nineyearSystemSeriesData
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
			        // itemStyle: { //图形样式
			        //     normal: {
			        //         borderColor: '#ffffff',
			        //         borderWidth:5,
			        //     },
			        // },
			        data:(i === 0? this.kindergartenSeriesData:
			        	(i === 1? this.primarySchoolSeriesData:
			        	(i === 2? this.middleSchoolSeriesData:
			        	this.nineyearSystemSeriesData)))
				});
			}
	};
	this.load_radar_chart(type,seriesData);
}
//加载极坐标系南丁格尔叠加玫瑰图表数据
PublicServiceEducation.prototype.load_radar_chart = function(type_name, seriesData){
	var radarChart = echarts.init(document.getElementById("public_service_radar_content"));
	var option = {
    	color: type_name === "1"?["#00FFFF"]:
				(type_name === "2"?["#3ba0f3"]:
				(type_name === "3"?['#ff9921']:
				((type_name === "4"?['#f36119']: ["#00FFFF","#3ba0f3",'#ff9921','#f36119'])))),
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
	            color:'#999',
		        formatter:function(val){
		            return val.split("").join("\n");
		        }
	        },
	        data: this.communityName,
	    },
	    radiusAxis: {
	        min: 0,
	        max: 10,
	        interval: 2
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
	        	color:"#999",
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
	        data: this.communityName
	    },
	    yAxis: {
	        type: "value",
	        axisLabel: coordinate_axis_style.axisLabel,
	        axisLine: coordinate_axis_style.axisLine,
	        splitLine: coordinate_axis_style.splitLine,
	        name: "人数"
	    },
	    series: this.barSeriesData
	};
    myChart.setOption(option, true);
}
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
	this.barSeriesData = [];//柱状图渲染数据
	this.kindergartenSeriesData = [];//幼儿园
	this.primarySchoolSeriesData = [];//小学
	this.middleSchoolSeriesData = [];//中学
	this.nineyearSystemSeriesData = [];//九年一贯制
}
var start_education_rendering = new PublicServiceEducation();