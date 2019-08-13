// 公共服务设施--概览
function PublicServiceOverview() {
	this.lenged_data = ["便民设施", "教育设施", "医疗设施", "养老设施", "文体设施", "交通设施", "街道管理设施"];
	this.community_name = [];
	this.radar_chart_indicator_data = [];
	this.comprehensive_data = {
        "便民设施":[0,0,0,0,0,0,0,0,0,0,0,0],
        "教育设施":[0,0,0,0,0,0,0,0,0,0,0,0],
        "医疗设施":[0,0,0,0,0,0,0,0,0,0,0,0],
        "文体设施":[0,0,0,0,0,0,0,0,0,0,0,0],
        "养老设施":[0,0,0,0,0,0,0,0,0,0,0,0],
        "交通设施":[0,0,0,0,0,0,0,0,0,0,0,0],
        "街道管理设施":[0,0,0,0,0,0,0,0,0,0,0,0],
    };
    this.current_series_data = [];
	this.ranking_list = [
		{ type:"便民", name:"北新仓", value: 95 },
		{ type:"教育", name:"海运仓", value: 95 },
		{ type:"医疗", name:"十二条", value: 95 },
		{ type:"文体", name:"青龙", value: 95 },
		{ type:"交通", name:"十三条", value: 95 },
		{ type:"养老", name:"门楼", value: 95 },
		{ type:"街管", name:"北宫厅", value: 95 },
	]
}
PublicServiceOverview.prototype.init = function(){
	this.reset_data();
	this.load_dom();
	this.click_dom();
	const _this = this;
	serveRequest("get", server_url+ "/Coverage/getCoverageOverview",{ },function(result){
		_this.get_view_data(result.data.resultKey);
		_this.load_chart("全部");
	});
	//设施排行榜no.1
	serveRequest("get", server_url+ "/Coverage/getCoverageOrder",{ },function(result){
		var ranking_list = result.data.resultKey;
		for(var i = 0; i < ranking_list.length; i++){
			var item = ranking_list[i];
			_this.ranking_list.push(
				{ type: item.CATEGORY_NAME, name: item["MIN(COMMUNITY_NAME)"], value: item.TOTAL_COVERAGE.toFixed(0) }
			);
		}
		_this.load_ranking_list(_this.ranking_list);
	});
}
//分类拆分数据
PublicServiceOverview.prototype.get_view_data = function(result_data){
	for(var i = 0; i < result_data.length; i++){
	    for(var key in result_data[i]){
	        this.community_name.push(key);
	        this.radar_chart_indicator_data.push({
	            name: key,
	            max: 1500,
	        })
	        if(result_data[i][key].length > 0){
	            for(var j = 0; j < result_data[i][key].length; j++){
	                this.comprehensive_data[result_data[i][key][j].CATEGORY_NAME][i] = result_data[i][key][j].TOTAL_COVERAGE;
	            }
	        }
	    }
	}
}
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
		_this.load_chart($(this).html());
	});
}
//加载图表数据
PublicServiceOverview.prototype.load_chart = function(type){
	this.current_series_data = [];
	switch (type){
		case "便民" :
			this.current_series_data.push({...rader_color[0], ...{
		        "name": this.lenged_data[0],
		        "data": [
					this.comprehensive_data[this.lenged_data[0]]
		        ]
		    }});
		    for(var i = 0; i < this.radar_chart_indicator_data.length; i++){
		    	this.radar_chart_indicator_data[i].max = 1700;
		    }
			break;
		case "教育" :
			this.current_series_data.push({...rader_color[1], ...{
		        "name": this.lenged_data[1],
		        "data": [
					this.comprehensive_data[this.lenged_data[1]]
		        ]
		    }}
			);
		    for(var i = 0; i < this.radar_chart_indicator_data.length; i++){
		    	this.radar_chart_indicator_data[i].max = 500;
		    }
			break;
		case "医疗" :
			this.current_series_data.push({...rader_color[2], ...{
		        "name": this.lenged_data[2],
		        "data": [
					this.comprehensive_data[this.lenged_data[2]]
		        ]
		    }}
			);
		    for(var i = 0; i < this.radar_chart_indicator_data.length; i++){
		    	this.radar_chart_indicator_data[i].max = 600;
		    }
			break;
		case "养老" :
			this.current_series_data.push({...rader_color[3], ...{
		        "name": this.lenged_data[3],
		        "data": [
					this.comprehensive_data[this.lenged_data[3]]
		        ]
		    }}
			);
		    for(var i = 0; i < this.radar_chart_indicator_data.length; i++){
		    	this.radar_chart_indicator_data[i].max = 1000;
		    }
			break;
		case "文体" :
			this.current_series_data.push({...rader_color[4], ...{
		        "name": this.lenged_data[4],
		        "data": [
					this.comprehensive_data[this.lenged_data[4]]
		        ]
		    }}
			);
		    for(var i = 0; i < this.radar_chart_indicator_data.length; i++){
		    	this.radar_chart_indicator_data[i].max = 500;
		    }
			break;
		case "交通" :
			this.current_series_data.push({...rader_color[5], ...{
		        "name": this.lenged_data[5],
		        "data": [
					this.comprehensive_data[this.lenged_data[5]]
		        ]
		    }}
			);
		    for(var i = 0; i < this.radar_chart_indicator_data.length; i++){
		    	this.radar_chart_indicator_data[i].max = 1700;
		    }
			break;
		case "街道管理" :
			this.current_series_data.push({...rader_color[6], ...{
		        "name": this.lenged_data[6],
		        "data": [
					this.comprehensive_data[this.lenged_data[6]]
		        ]
		    }}
			);
		    for(var i = 0; i < this.radar_chart_indicator_data.length; i++){
		    	this.radar_chart_indicator_data[i].max = 600;
		    }
			break;
		case "全部" :
			for(var i = 0; i < this.lenged_data.length; i++){
				this.current_series_data.push({...rader_color[i], ...{
			        "name": this.lenged_data[i],
			        "data": [
						this.comprehensive_data[this.lenged_data[i]]
			        ]
			    }}
				);
			}
		    for(var i = 0; i < this.radar_chart_indicator_data.length; i++){
		    	this.radar_chart_indicator_data[i].max = 1700;
		    }
			break;
	}
	this.load_radar_chart();
}
//加载雷达图表数据
PublicServiceOverview.prototype.load_radar_chart = function(type_name){
	var radarChart = echarts.init(document.getElementById("public_service_radar_content"));
	var radar_option = {
		color: echarts_color,
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
	        "indicator": this.radar_chart_indicator_data
	    },
	    "series": this.current_series_data
	};
    radarChart.setOption(radar_option, true);
}
//重置数据
PublicServiceOverview.prototype.reset_data = function(){
	this.community_name = [];
	this.radar_chart_indicator_data = [];
	this.comprehensive_data = {
        "便民设施":[0,0,0,0,0,0,0,0,0,0,0,0],
        "教育设施":[0,0,0,0,0,0,0,0,0,0,0,0],
        "医疗设施":[0,0,0,0,0,0,0,0,0,0,0,0],
        "文体设施":[0,0,0,0,0,0,0,0,0,0,0,0],
        "养老设施":[0,0,0,0,0,0,0,0,0,0,0,0],
        "交通设施":[0,0,0,0,0,0,0,0,0,0,0,0],
        "街道管理设施":[0,0,0,0,0,0,0,0,0,0,0,0],
    };
    this.current_series_data = [];
    this.ranking_list = [];
}
//加载排行榜统计
PublicServiceOverview.prototype.load_ranking_list = function(data){
	for(var i = 0; i < data.length; i++){
		$("#public_service_ranking_content").append('<p class="ranking_list"><span class="type_name">'
			+data[i].type+'：&nbsp;&nbsp;</span><span class="name_value">'+data[i].name+'（'+data[i].value+'%）</span></p>')
	}
}

var start_overview_rendering = new PublicServiceOverview();